from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.models.course import AssessmentResult, Course
from app.models.user import User
from app.api.v1.auth import get_current_user_optional
from app.core.seed_data import ASSESSMENT_QUESTIONS

router = APIRouter()

class DiagnosticQuestionResponse(BaseModel):
    id: str
    pillar: str
    pillar_key: str
    question: str
    options: List[str]

class DiagnosticSubmitRequest(BaseModel):
    answers: Dict[str, int]  # question_id -> chosen option index

class DimensionScore(BaseModel):
    key: str
    label: str
    score: int  # 0 to 100
    status: str  # Excellent, Proficient, Needs Work

class DiagnosticReportResponse(BaseModel):
    overall_score: int
    readiness_level: str
    archetype: str
    archetype_summary: str
    radar_data: List[DimensionScore]
    strengths: List[str]
    blindspots: List[str]
    recommended_courses: List[Dict[str, Any]]
    xp_earned: int = 200

PILLAR_META = {
    "market": {"label": "Market & Validation", "course_slug": "zero-to-one-ideation"},
    "product": {"label": "Product & MVP", "course_slug": "lean-mvp-playbook"},
    "gtm": {"label": "Go-To-Market & Growth", "course_slug": "growth-hacking-gtm-strategy"},
    "finance": {"label": "Unit Economics & Finance", "course_slug": "unit-economics-financial-modeling"},
    "fundraising": {"label": "Fundraising & Pitching", "course_slug": "venture-capital-pitching-playbook"},
    "execution": {"label": "Execution & Legal", "course_slug": "founder-legal-cap-tables"}
}

def determine_archetype(dim_scores: Dict[str, int], overall: int) -> tuple[str, str]:
    highest_key = max(dim_scores, key=dim_scores.get)
    highest_val = dim_scores[highest_key]

    if overall >= 85:
        return (
            "The Renaissance Founder",
            "You possess an elite, holistic blend of technical capability, market intuition, financial discipline, and fundraising acumen. Ready to lead high-growth venture-backed teams."
        )

    archetypes = {
        "market": (
            "The Customer Whisperer",
            "Exceptional intuition for unmet user needs, acute pain identification, and rigorous customer discovery."
        ),
        "product": (
            "The Product Visionary",
            "Master of rapid prototyping, MVP prioritization, and frictionless user experiences."
        ),
        "gtm": (
            "The Growth Engine",
            "A master of acquisition loops, distribution mechanics, and viral funnel optimization."
        ),
        "finance": (
            "The Financial Strategist",
            "Disciplined capital allocator with deep mastery of unit economics, runway preservation, and CAC/LTV dynamics."
        ),
        "fundraising": (
            "The Venture Magnet",
            "Compelling storyteller capable of commanding room presence, negotiating SAFEs, and aligning investors."
        ),
        "execution": (
            "The Agile Operator",
            "High velocity execution machine capable of navigating legal landmines, rapid pivoting, and building scalable processes."
        )
    }
    return archetypes.get(highest_key, ("The Emerging Founder", "Building foundational instincts across early-stage startup disciplines."))

@router.get("/questions", response_model=List[DiagnosticQuestionResponse])
async def get_diagnostic_questions():
    return [
        DiagnosticQuestionResponse(
            id=q["id"],
            pillar=q["pillar"],
            pillar_key=q["pillar_key"],
            question=q["question"],
            options=q["options"]
        )
        for q in ASSESSMENT_QUESTIONS
    ]

@router.get("/latest", response_model=Optional[DiagnosticReportResponse])
async def get_latest_assessment(
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    if not user:
        return None

    result = await db.execute(
        select(AssessmentResult)
        .filter(AssessmentResult.user_id == user.id)
        .order_by(AssessmentResult.id.desc())
    )
    last = result.scalars().first()
    if not last:
        return None

    dims = last.dimensions or {}
    radar = []
    for key, meta in PILLAR_META.items():
        score = dims.get(key, 70)
        status = "Excellent" if score >= 80 else ("Proficient" if score >= 50 else "Needs Work")
        radar.append(DimensionScore(key=key, label=meta["label"], score=score, status=status))

    arch_title, arch_desc = determine_archetype(dims, last.overall_score)

    return DiagnosticReportResponse(
        overall_score=last.overall_score,
        readiness_level=last.readiness_level,
        archetype=last.archetype,
        archetype_summary=arch_desc,
        radar_data=radar,
        strengths=last.strengths or [],
        blindspots=last.blindspots or [],
        recommended_courses=last.recommended_courses or [],
        xp_earned=0
    )

@router.post("/submit", response_model=DiagnosticReportResponse)
async def submit_diagnostic(
    payload: DiagnosticSubmitRequest,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    # Track scores per pillar
    pillar_totals = {k: 0 for k in PILLAR_META.keys()}
    pillar_correct = {k: 0 for k in PILLAR_META.keys()}

    for q in ASSESSMENT_QUESTIONS:
        pkey = q["pillar_key"]
        pillar_totals[pkey] += 1
        user_choice = payload.answers.get(q["id"], -1)
        if user_choice == q["correct_index"]:
            pillar_correct[pkey] += 1

    dim_scores = {}
    radar_data = []
    strengths = []
    blindspots = []
    weak_keys = []

    for key, meta in PILLAR_META.items():
        total = pillar_totals[key] or 1
        corr = pillar_correct[key]
        pct = int((corr / total) * 100)
        dim_scores[key] = pct

        status = "Excellent" if pct >= 80 else ("Proficient" if pct >= 50 else "Needs Work")
        radar_data.append(DimensionScore(key=key, label=meta["label"], score=pct, status=status))

        if pct >= 80:
            strengths.append(f"{meta['label']} ({pct}% mastery)")
        elif pct <= 50:
            blindspots.append(f"{meta['label']} ({pct}% - priority focus area)")
            weak_keys.append(key)

    overall = int(sum(dim_scores.values()) / len(dim_scores)) if dim_scores else 50
    readiness_level = (
        "High Venture Readiness" if overall >= 80
        else ("Moderate Readiness" if overall >= 60 else "Foundational Stage")
    )
    archetype, arch_summary = determine_archetype(dim_scores, overall)

    # Find recommended courses based on weak pillars
    recommended_courses = []
    course_res = await db.execute(select(Course))
    all_courses = course_res.scalars().all()
    course_map = {c.slug: c for c in all_courses}

    for wk in weak_keys[:2]:
        slug = PILLAR_META.get(wk, {}).get("course_slug")
        if slug and slug in course_map:
            c = course_map[slug]
            recommended_courses.append({
                "id": c.id,
                "slug": c.slug,
                "title": c.title,
                "category": c.category,
                "difficulty": c.difficulty,
                "duration": c.duration,
                "rating": c.rating,
                "cover_tag": c.cover_tag
            })

    # If no weak pillars, recommend advanced courses
    if not recommended_courses and all_courses:
        c = all_courses[0]
        recommended_courses.append({
            "id": c.id,
            "slug": c.slug,
            "title": c.title,
            "category": c.category,
            "difficulty": c.difficulty,
            "duration": c.duration,
            "rating": c.rating,
            "cover_tag": c.cover_tag
        })

    if user:
        user.xp = (user.xp or 0) + 200
        db.add(user)

        record = AssessmentResult(
            user_id=user.id,
            overall_score=overall,
            readiness_level=readiness_level,
            archetype=archetype,
            dimensions=dim_scores,
            strengths=strengths,
            blindspots=blindspots,
            recommended_courses=recommended_courses
        )
        db.add(record)
        await db.commit()

    return DiagnosticReportResponse(
        overall_score=overall,
        readiness_level=readiness_level,
        archetype=archetype,
        archetype_summary=arch_summary,
        radar_data=radar_data,
        strengths=strengths,
        blindspots=blindspots,
        recommended_courses=recommended_courses,
        xp_earned=200
    )
