from pydantic import BaseModel
from typing import Optional, List

class StartPitchRequest(BaseModel):
    project_id: int
    persona: str = "aggressive_vc"

class PitchMessageRequest(BaseModel):
    message: str

class PitchMessageResponse(BaseModel):
    sender: str
    message: str
    rating: Optional[int] = None
    criticismTag: Optional[str] = None

class PitchSessionResponse(BaseModel):
    id: int
    project_id: int
    persona: str
    chat_history: List[PitchMessageResponse]

    class Config:
        from_attributes = True