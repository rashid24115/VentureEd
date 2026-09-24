from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class ProjectCreate(BaseModel):
    title: str
    idea_description: str
    industry_category: str = "General Tech"

class ProjectResponse(ProjectCreate):
    id: int
    user_id: int
    feasibility_score: Optional[int] = None
    swot_analysis: Optional[Dict[str, List[str]]] = None
    created_at: datetime

    class Config:
        from_attributes = True