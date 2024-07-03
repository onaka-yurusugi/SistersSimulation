from fastapi import APIRouter, HTTPException
from models import EvaluationRequest
from openai import OpenAI
from config import settings
import logging

router = APIRouter()

# ロガーの設定
logger = logging.getLogger(__name__)

openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

@router.post("/evaluate")
async def evaluate_message(request: EvaluationRequest):
    prompt = request.prompt

    # デバッグ: リクエストデータの確認
    logger.info(f"Received prompt: {prompt}")

    try:
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        result = completion.choices[0].message.content.strip()
        logger.info(f"Received result: {result}")

    except Exception as e:
        logger.error("API error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"API error: {str(e)}")

    return {"result": result}