from pydantic import BaseModel, Field
from typing import List

class LeanCanvasSchema(BaseModel):
    problem: List[str] = Field(description="Top 3 core problems solved")
    solution: List[str] = Field(description="Top 3 key features solving the problems")
    key_metrics: List[str] = Field(description="Key metrics to track business health")
    unique_value_proposition: str = Field(description="Single, compelling message")
    unfair_advantage: str = Field(description="Advantage that cannot easily be copied")
    channels: List[str] = Field(description="Pathways to reach target customers")
    customer_segments: List[str] = Field(description="Target audience profiles")
    cost_structure: List[str] = Field(description="Fixed and variable operating costs")
    revenue_streams: List[str] = Field(description="Monetization and pricing models")

class LeanCanvasResponse(LeanCanvasSchema):
    id: int
    project_id: int

    class Config:
        from_attributes = True