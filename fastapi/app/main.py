from fastapi import FastAPI
from routers.evaluate import router as evaluate_router
import logging

# ロガーの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(evaluate_router)
