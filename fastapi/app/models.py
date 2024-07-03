from pydantic import BaseModel

class EvaluationRequest(BaseModel):
    message: str = "髪型変えたんだね、すごく似合ってるよ。"
    personality: str = "ツンデレ妹"
    current_affection: int = 0
