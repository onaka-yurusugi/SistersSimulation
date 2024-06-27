from fastapi import APIRouter, HTTPException, Depends
from models import EvaluationRequest
from services import GameRules
import logging
import json

router = APIRouter()

# ロガーの設定
logger = logging.getLogger(__name__)

# 親愛度の初期値
affection_score = 0

game_rules = GameRules()

# グローバル変数として親愛度の累計を管理
affection_total = {"score": 0}

@router.post("/evaluate")
async def evaluate_message(request: EvaluationRequest):
    global affection_total

    user_message = request.message
    personality = request.personality

    # デバッグ: リクエストデータの確認
    logger.info(f"Received message: {user_message}")
    logger.info(f"Received personality: {personality}")

    prompt = game_rules.create_prompt(user_message, personality, affection_total["score"])

    try:
        completion = game_rules.call_openai_api(prompt, personality)
        result_json = game_rules.process_response(completion)

        # 必須フィールドの存在をデバッグ出力
        logger.info("評価: %s", result_json.get('評価'))
        logger.info("メッセージ: %s", result_json.get('メッセージ'))
        logger.info("心の声: %s", result_json.get('心の声'))
    except json.JSONDecodeError:
        logger.error("Invalid JSON response from OpenAI API")
        raise HTTPException(status_code=500, detail="Invalid JSON response from OpenAI API")
    except Exception as e:
        logger.error("API error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")

    # JSONレスポンスから評価、メッセージ、心の声を取得
    evaluation = result_json.get('評価')
    response_message = result_json.get('反応')
    feedback = result_json.get('心の声')

    # 必須フィールドの存在を確認
    if evaluation is None or response_message is None or feedback is None:
        logger.error("Incomplete response from OpenAI API")
        raise HTTPException(status_code=500, detail="Incomplete response from OpenAI API")

    # 親愛度の調整
    affection_total["score"] += evaluation

    # デレイベントのトリガー
    if affection_total["score"] > 100:
        return {
            "message": "妹がデレました！",
            "評価": evaluation,
            "累計親愛度": affection_total["score"],
            "反応": response_message,
            "心の声": f"({feedback})"
        }

    return {
        "message": "評価完了",
        "評価": evaluation,
        "累計親愛度": affection_total["score"],
        "反応": response_message,
        "心の声": f"({feedback})"
    }
