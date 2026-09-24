from pydantic import BaseModel
from typing import List, Optional

class CopilotRequest(BaseModel):
    idea: str
    mode: str = "raise_value"  # "raise_value", "market_problems", "unique_feature", "standout"
    industry: Optional[str] = "Tech / SaaS"
    weakness_context: Optional[str] = None

class CopilotResponse(BaseModel):
    mode: str
    mode_label: str
    headline: str
    summary: str
    action_steps: List[str]
    strategic_insights: List[str]
    metrics_to_track: List[str]
    suggested_unique_hooks: List[str]
