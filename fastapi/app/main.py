from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.evaluate import router as evaluate_router
import logging

# ロガーの設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORSの設定
origins = [
    "http://localhost",  # 許可するオリジンをここに追加
    "http://localhost:8101",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluate_router)
