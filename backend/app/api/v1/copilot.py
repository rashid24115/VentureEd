from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.models.course import CourseEnrollment, QuizSubmission, AssessmentResult
from app.models.user import User
from app.schemas.copilot import CopilotRequest, CopilotResponse
from app.services.copilot_service import copilot_service
from app.api.v1.auth import get_current_user_optional

router = APIRouter()

class UserIntelligenceResponse(BaseModel):
    user_name: str
    overall_readiness: int
    archetype: str
    strengths: List[str]
    weaknesses: List[str]
    quizzes_taken: int
    recommended_copilot_mode: str
    suggested_prompt: str

@router.post("/advice", response_model=CopilotResponse)
async def get_copilot_advice(payload: CopilotRequest):
    if not payload.idea.strip():
        raise HTTPException(status_code=400, detail="Startup idea description cannot be empty")

    advice = await copilot_service.get_advice(
        idea=payload.idea,
        mode=payload.mode,
        industry=payload.industry or "Tech / SaaS",
        weakness=payload.weakness_context
    )
    return advice

@router.get("/user-intelligence", response_model=UserIntelligenceResponse)
async def get_user_intelligence(
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = user.id if user else 1
    user_name = user.name if user else "Founder"

    # Fetch assessment
    assessment_res = await db.execute(
        select(AssessmentResult)
        .filter(AssessmentResult.user_id == user_id)
        .order_by(AssessmentResult.id.desc())
    )
    latest_assessment = assessment_res.scalars().first()

    # Fetch quiz submissions
    quiz_res = await db.execute(
        select(QuizSubmission).filter(QuizSubmission.user_id == user_id)
    )
    submissions = quiz_res.scalars().all()
    quizzes_count = len(submissions)

    if latest_assessment:
        overall = latest_assessment.overall_score
        archetype = latest_assessment.archetype
        strengths = latest_assessment.strengths or ["Rapid Prototyping", "Customer Empathy"]
        weaknesses = latest_assessment.blindspots or ["Unit Economics & CAC Payback"]
    else:
        overall = 78
        archetype = "The Product Visionary"
        strengths = ["Product & MVP Design (85% mastery)", "Market Problem Validation (80% mastery)"]
        weaknesses = ["Unit Economics & Pricing Power (60% - priority focus area)"]

    # Recommend appropriate co-pilot mode based on weaknesses
    rec_mode = "raise_value"
    if any("market" in w.lower() for w in weaknesses):
        rec_mode = "market_problems"
    elif any("product" in w.lower() or "mvp" in w.lower() for w in weaknesses):
        rec_mode = "unique_feature"
    elif any("gtm" in w.lower() or "growth" in w.lower() for w in weaknesses):
        rec_mode = "standout"

    suggested_prompt = (
        f"How can I fix my blindspot in '{weaknesses[0] if weaknesses else 'Pricing'}' "
        f"and make my startup command high value in the market?"
    )

    return UserIntelligenceResponse(
        user_name=user_name,
        overall_readiness=overall,
        archetype=archetype,
        strengths=strengths,
        weaknesses=weaknesses,
        quizzes_taken=quizzes_count,
        recommended_copilot_mode=rec_mode,
        suggested_prompt=suggested_prompt
    )
