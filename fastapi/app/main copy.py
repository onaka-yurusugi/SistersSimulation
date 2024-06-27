from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
from openai import OpenAI

app = FastAPI()

# .envファイルから環境変数を読み込む
load_dotenv()

# ChatGPT APIキーを設定
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# 親愛度の初期値
affection_score = 0

# 妹の性格のリスト
personalities = {
    "tsundere": "あなたは表面上は冷たくてそっけないけれど、実は兄のことをとても大切に思っているツンデレの妹です。",
    "coodere": "あなたは普段は無表情でクールだけど、内面は兄のことを深く気にかけているクーデレの妹です。",
    "deredere": "あなたはとても兄思いの優しい妹です。",
    "yandere": "あなたは嫉妬深くて兄に執着するヤンデレの妹です。",
    "sporty": "あなたは常にアクティブで、兄を運動に誘うスポーツ好きな妹です。",
    "nerdy": "あなたは科学雑誌を読むのが好きで、常に新しい知識を共有したがる知的な妹です。",
    "calm": "あなたは兄の話をじっくり聞き、穏やかな癒しを提供するおっとりした妹です。",
    "mysterious": "あなたはいつも謎に包まれた言動をする、ミステリアスな雰囲気の妹です。",
    "social_butterfly": "あなたは誰とでもすぐに友達になれる、パーティーが大好きな社交的な妹です。",
    "creative": "あなたは絵を描いたり音楽を作ったりするクリエイティブな活動に情熱を注ぐ妹です。",
    "leader": "あなたは自己主張が強く、チームのリーダーとして行動することが多い気が強い妹です。",
    "dreamy": "あなたは物語や映画のロマンスに憧れる、いつも夢見がちな妹です。"
}

system_message = "あなたは親愛なる兄との会話をしています。100文字程度の一言で回答してください｡"

class EvaluationRequest(BaseModel):
    message: str = "髪型変わった？かわいいね。"
    personality: str = "tsundere"

def create_prompt(message: str, personality: str, affection_score: int) -> str:
    if affection_score < 0:
        reaction = "親愛度が低いため、冷たい反応を返してください。"
    elif affection_score < 50:
        reaction = "親愛度が中程度のため、少し冷たいが関心を持っている反応を返してください。"
    else:
        reaction = "親愛度が高いため、とても暖かい反応を返してください。"

    return f"""
    以下の発言に対する評価、反応メッセージ、および攻略のアドバイスをJSON形式で出力してください。
    発言: "{message}"
    妹の性格: {personalities[personality]}
    {reaction}
    評価: [-50~+50]の範囲で数値化してください。
    出力形式は以下のようにしてください：
    {{
        "評価": 数値,
        "メッセージ": "反応メッセージ",
        "心の声": "攻略のヒントにもなるような妹の心の中の反応"
    }}
    例:
    {{
        "評価": 40,
        "メッセージ": "ありがとう。気に入ったみたいでよかった。",
        "心の声": "褒めてくれて嬉しいけど、他の変化も見て欲しいな。"
    }}
    """

def call_openai_api(prompt: str, personality: str):
    return client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "system", "content": personalities[personality]},
            {"role": "user", "content": prompt}
        ]
    )

@app.post("/evaluate")
async def evaluate_message(request: EvaluationRequest):
    global affection_score

    user_message = request.message
    personality = request.personality

    # デバッグ: リクエストデータの確認
    print(f"Received message: {user_message}")
    print(f"Received personality: {personality}")

    prompt = create_prompt(user_message, personality, affection_score)

    try:
        completion = call_openai_api(prompt, personality)
        result = completion.choices[0].message.content.strip()

        # デバッグ: APIの生のレスポンスを出力
        print("API Response:", result)

        # コードブロックを削除
        result = result.replace("```json", "").replace("```", "").strip()

        # JSONレスポンスをデコード
        result_json = json.loads(result)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response from OpenAI API"}
    except Exception as e:
        return {"error": f"API error: {str(e)}"}

    # JSONレスポンスから評価、メッセージ、心の声を取得
    evaluation = result_json.get('評価')
    response_message = result_json.get('メッセージ')
    feedback = result_json.get('心の声')

    # 必須フィールドの存在を確認
    if evaluation is None or response_message is None or feedback is None:
        return {"error": "Incomplete response from OpenAI API"}

    # 親愛度の調整
    affection_score += evaluation

    # デレイベントのトリガー
    if affection_score > 100:
        return {"message": "妹がデレました！", "affection_score": affection_score, "response": response_message, "feedback": feedback}

    return {"message": "評価完了", "affection_score": affection_score, "response": response_message, "feedback": feedback}
