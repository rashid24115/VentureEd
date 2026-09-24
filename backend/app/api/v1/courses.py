from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.core.database import get_db
from app.models.course import Course, CourseEnrollment
from app.models.user import User
from app.api.v1.auth import get_current_user_optional

router = APIRouter()

class LessonProgressUpdate(BaseModel):
    lesson_id: str
    completed: bool = True

class CourseItemResponse(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    difficulty: str
    duration: str
    rating: float
    students_count: int
    description: str
    cover_tag: str
    icon_name: str
    modules_count: int
    lessons_count: int
    is_enrolled: bool = False
    progress_percent: int = 0
    quiz_completed: bool = False

class CourseDetailResponse(CourseItemResponse):
    syllabus: List[Dict[str, Any]]
    completed_lessons: List[str] = []

@router.get("/", response_model=List[CourseItemResponse])
async def list_courses(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    query = select(Course)
    result = await db.execute(query)
    all_courses = result.scalars().all()

    # Fetch user enrollments if user exists
    user_enrollments = {}
    if user:
        enr_result = await db.execute(select(CourseEnrollment).filter(CourseEnrollment.user_id == user.id))
        for enr in enr_result.scalars().all():
            user_enrollments[enr.course_id] = enr

    response = []
    for c in all_courses:
        # Filtering
        if category and category.lower() != "all" and c.category.lower() != category.lower():
            continue
        if difficulty and difficulty.lower() != "all" and c.difficulty.lower() != difficulty.lower():
            continue
        if search:
            s = search.lower()
            if s not in c.title.lower() and s not in c.description.lower() and s not in c.category.lower():
                continue

        syllabus = c.syllabus or []
        modules_count = len(syllabus)
        lessons_count = sum(len(m.get("lessons", [])) for m in syllabus)

        enr = user_enrollments.get(c.id)
        is_enrolled = enr is not None
        progress = enr.progress_percent if enr else 0
        quiz_done = bool(enr and enr.quiz_completed)

        response.append(CourseItemResponse(
            id=c.id,
            slug=c.slug,
            title=c.title,
            category=c.category,
            difficulty=c.difficulty,
            duration=c.duration,
            rating=c.rating,
            students_count=c.students_count,
            description=c.description,
            cover_tag=c.cover_tag,
            icon_name=c.icon_name,
            modules_count=modules_count,
            lessons_count=lessons_count,
            is_enrolled=is_enrolled,
            progress_percent=progress,
            quiz_completed=quiz_done
        ))

    return response

@router.get("/{course_id}", response_model=CourseDetailResponse)
async def get_course_detail(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    result = await db.execute(select(Course).filter(Course.id == course_id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enr = None
    if user:
        enr_res = await db.execute(
            select(CourseEnrollment).filter(
                CourseEnrollment.user_id == user.id,
                CourseEnrollment.course_id == course.id
            )
        )
        enr = enr_res.scalars().first()

    syllabus = course.syllabus or []
    modules_count = len(syllabus)
    lessons_count = sum(len(m.get("lessons", [])) for m in syllabus)

    return CourseDetailResponse(
        id=course.id,
        slug=course.slug,
        title=course.title,
        category=course.category,
        difficulty=course.difficulty,
        duration=course.duration,
        rating=course.rating,
        students_count=course.students_count,
        description=course.description,
        cover_tag=course.cover_tag,
        icon_name=course.icon_name,
        modules_count=modules_count,
        lessons_count=lessons_count,
        is_enrolled=enr is not None,
        progress_percent=enr.progress_percent if enr else 0,
        quiz_completed=bool(enr and enr.quiz_completed),
        syllabus=syllabus,
        completed_lessons=enr.completed_lessons if enr else []
    )

@router.post("/{course_id}/enroll")
async def enroll_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required to enroll")

    course_res = await db.execute(select(Course).filter(Course.id == course_id))
    course = course_res.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enr_res = await db.execute(
        select(CourseEnrollment).filter(
            CourseEnrollment.user_id == user.id,
            CourseEnrollment.course_id == course_id
        )
    )
    existing_enr = enr_res.scalars().first()
    if not existing_enr:
        new_enr = CourseEnrollment(
            user_id=user.id,
            course_id=course_id,
            progress_percent=0,
            completed_lessons=[]
        )
        db.add(new_enr)
        course.students_count = (course.students_count or 0) + 1
        db.add(course)
        await db.commit()

    return {"message": "Enrolled successfully", "course_id": course_id}

@router.post("/{course_id}/progress")
async def update_lesson_progress(
    course_id: int,
    payload: LessonProgressUpdate,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    course_res = await db.execute(select(Course).filter(Course.id == course_id))
    course = course_res.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

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
            progress_percent=0,
            completed_lessons=[]
        )
        db.add(enr)

    completed = list(enr.completed_lessons or [])
    if payload.completed and payload.lesson_id not in completed:
        completed.append(payload.lesson_id)
        user.xp = (user.xp or 0) + 25  # Award XP
        db.add(user)
    elif not payload.completed and payload.lesson_id in completed:
        completed.remove(payload.lesson_id)

    # Calculate total lessons in course
    syllabus = course.syllabus or []
    total_lessons = sum(len(m.get("lessons", [])) for m in syllabus) or 1
    progress_percent = min(100, int((len(completed) / total_lessons) * 100))

    enr.completed_lessons = completed
    enr.progress_percent = progress_percent
    db.add(enr)
    await db.commit()

    return {
        "course_id": course_id,
        "completed_lessons": completed,
        "progress_percent": progress_percent,
        "xp": user.xp
    }
