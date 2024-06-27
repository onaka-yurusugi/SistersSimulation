import json
from openai import OpenAI
from config import settings

class GameRules:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.personalities = {
            "ツンデレ妹": "あなたは表面上は冷たくてそっけないけれど、実は兄のことをとても大切に思っているツンデレの妹です。",
            "クーデレ妹": "あなたは普段は無表情でクールだけど、内面は兄のことを深く気にかけているクーデレの妹です。",
        }
        self.system_message = "あなたは親愛なる兄との会話をしています。100文字程度の一言で回答してください｡"

    def create_prompt(self, message: str, personality: str, affection_score: int) -> str:
        if affection_score < 0:
            reaction = "親愛度が低いため、冷たい反応を返してください。"
        elif affection_score < 50:
            reaction = "親愛度が中程度のため、少し冷たいが関心を持っている反応を返してください。"
        elif affection_score < 100:
            reaction = "親愛度が高いため、とても暖かい反応を返してください。"
        else:
            reaction = "親愛度がとても高いため、どデカい恋愛感情を持った反応を返してください。"

        return f"""
        以下の発言に対する評価、反応メッセージ、および攻略のアドバイスをJSON形式で出力してください。
        発言: "{message}"
        妹の性格: {self.personalities[personality]}
        {reaction}
        評価: [-10~+30]の範囲で数値化してください。
        出力形式は以下のようにしてください：
        {{
            "評価": 数値,
            "反応": "反応メッセージ",
            "心の声": "攻略のヒントにもなるような妹の心の中の反応"
        }}
        例:
        {{
            "評価": 40,
            "反応": "ありがとう。気に入ったみたいでよかった。",
            "心の声": "褒めてくれて嬉しいけど、他の変化も見て欲しいな。"
        }}
        """

    def call_openai_api(self, prompt: str, personality: str):
        return self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": self.system_message},
                {"role": "system", "content": self.personalities[personality]},
                {"role": "user", "content": prompt}
            ]
        )

    def process_response(self, completion):
        result = completion.choices[0].message.content.strip()
        result = result.replace("```json", "").replace("```", "").strip()
        return json.loads(result)
