from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.models.course import Course, CourseEnrollment, QuizSubmission
from app.models.user import User
from app.api.v1.auth import get_current_user_optional

router = APIRouter()

class QuizSubmitRequest(BaseModel):
    answers: Dict[str, int]  # question_id -> selected option index

class QuestionResponse(BaseModel):
    id: str
    question: str
    options: List[str]

class QuizDetailResponse(BaseModel):
    course_id: int
    course_title: str
    questions: List[QuestionResponse]
    previous_score: Optional[int] = None

class QuestionGradingResult(BaseModel):
    id: str
    question: str
    selected_index: int
    correct_index: int
    is_correct: bool
    explanation: str

class QuizGradingResponse(BaseModel):
    course_id: int
    score: int
    total: int
    percentage: int
    passed: bool
    xp_earned: int
    results: List[QuestionGradingResult]

@router.get("/{course_id}", response_model=QuizDetailResponse)
async def get_quiz(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    course_res = await db.execute(select(Course).filter(Course.id == course_id))
    course = course_res.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    quiz_data = course.quiz_data or []
    questions = [
        QuestionResponse(
            id=q["id"],
            question=q["question"],
            options=q["options"]
        )
        for q in quiz_data
    ]

    previous_score = None
    if user:
        enr_res = await db.execute(
            select(CourseEnrollment).filter(
                CourseEnrollment.user_id == user.id,
                CourseEnrollment.course_id == course_id
            )
        )
        enr = enr_res.scalars().first()
        if enr and enr.quiz_score is not None:
            previous_score = enr.quiz_score

    return QuizDetailResponse(
        course_id=course.id,
        course_title=course.title,
        questions=questions,
        previous_score=previous_score
    )

@router.post("/{course_id}/submit", response_model=QuizGradingResponse)
async def submit_quiz(
    course_id: int,
    payload: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    course_res = await db.execute(select(Course).filter(Course.id == course_id))
    course = course_res.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    quiz_data = course.quiz_data or []
    if not quiz_data:
        raise HTTPException(status_code=400, detail="No quiz available for this course")

    correct_count = 0
    results: List[QuestionGradingResult] = []

    for q in quiz_data:
        qid = q["id"]
        correct_idx = q["correct_index"]
        selected_idx = payload.answers.get(qid, -1)
        is_corr = (selected_idx == correct_idx)

        if is_corr:
            correct_count += 1

        results.append(QuestionGradingResult(
            id=qid,
            question=q["question"],
            selected_index=selected_idx,
            correct_index=correct_idx,
            is_correct=is_corr,
            explanation=q.get("explanation", "")
        ))

    total = len(quiz_data)
    percentage = int((correct_count / total) * 100) if total > 0 else 0
    passed = percentage >= 70
    xp_earned = 100 if passed else 30

    if user:
        user.xp = (user.xp or 0) + xp_earned
        db.add(user)

        enr_res = await db.execute(
            select(CourseEnrollment).filter(
                CourseEnrollment.user_id == user.id,
                CourseEnrollment.course_id == course_id
            )
        )
        enr = enr_res.scalars().first()
        if not enr:
            enr = CourseEnrollment(
                user_id=user.id,
                course_id=course_id,
                progress_percent=100,
                completed_lessons=[],
                quiz_completed=1 if passed else 0,
                quiz_score=percentage
            )
            db.add(enr)
        else:
            enr.quiz_completed = 1 if passed else enr.quiz_completed
            enr.quiz_score = max(percentage, enr.quiz_score or 0)
            db.add(enr)

        submission = QuizSubmission(
            user_id=user.id,
            course_id=course_id,
            score=correct_count,
            total_questions=total,
            percentage=percentage,
            answers_summary=[r.model_dump() for r in results]
        )
        db.add(submission)
        await db.commit()

    return QuizGradingResponse(
        course_id=course_id,
        score=correct_count,
        total=total,
        percentage=percentage,
        passed=passed,
        xp_earned=xp_earned,
        results=results
    )
