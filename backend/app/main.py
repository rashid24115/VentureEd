from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from app.core.database import engine, Base, AsyncSessionLocal
import app.models 
from app.models.user import User
from app.models.course import Course, CourseEnrollment, AssessmentResult
from app.models.project import Project
from app.models.lean_canvas import LeanCanvas
from app.api.v1.router import api_router
from app.core.security import get_password_hash
from app.core.seed_data import COURSES_DATA
from app.services.ai_service import generate_fallback_canvas, generate_fallback_swot

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        # 1. Verify / Create default demo user
        user_res = await session.execute(select(User).filter(User.id == 1))
        default_user = user_res.scalars().first()
        if not default_user:
            default_user = User(
                id=1,
                name="Alex Rivera (Founder)",
                email="demo@ventureai.com",
                password_hash=get_password_hash("venture123"),
                xp=350,
                streak=4
            )
            session.add(default_user)
            await session.commit()
            print("[Init] Default demo founder user created (demo@ventureai.com / venture123)")

        # 2. Seed courses if none exist
        course_check = await session.execute(select(Course))
        if not course_check.scalars().first():
            for c_data in COURSES_DATA:
                course = Course(
                    id=c_data["id"],
                    slug=c_data["slug"],
                    title=c_data["title"],
                    category=c_data["category"],
                    difficulty=c_data["difficulty"],
                    duration=c_data["duration"],
                    rating=c_data["rating"],
                    students_count=c_data["students_count"],
                    description=c_data["description"],
                    cover_tag=c_data["cover_tag"],
                    icon_name=c_data["icon_name"],
                    syllabus=c_data["syllabus"],
                    quiz_data=c_data["quiz_data"]
                )
                session.add(course)
            await session.commit()
            print(f"[Init] Seeded {len(COURSES_DATA)} entrepreneurship courses successfully")

        # 3. Seed an initial sample project if empty
        proj_check = await session.execute(select(Project))
        if not proj_check.scalars().first():
            sample_desc = "AI-powered carbon tracking and ESG compliance platform for mid-market manufacturing companies to automate supply chain sustainability audits."
            sample_project = Project(
                id=1,
                user_id=1,
                title="EcoTrack AI",
                idea_description=sample_desc,
                industry_category="AI / SaaS",
                feasibility_score=88,
                swot_analysis=generate_fallback_swot(sample_desc)
            )
            session.add(sample_project)
            await session.commit()
            
            canvas_data = generate_fallback_canvas(sample_desc)
            sample_canvas = LeanCanvas(project_id=1, **canvas_data)
            session.add(sample_canvas)
            await session.commit()
            print("[Init] Seeded demo incubator startup (EcoTrack AI)")

        # 4. Seed initial enrollment & assessment baseline for demo user
        enr_check = await session.execute(select(CourseEnrollment).filter(CourseEnrollment.user_id == 1))
        if not enr_check.scalars().first():
            demo_enr = CourseEnrollment(
                user_id=1,
                course_id=1,
                progress_percent=50,
                completed_lessons=["l1_1", "l1_2"],
                quiz_completed=0,
                quiz_score=None
            )
            session.add(demo_enr)

            # Baseline diagnostic result
            demo_assessment = AssessmentResult(
                user_id=1,
                overall_score=78,
                readiness_level="High Venture Readiness",
                archetype="The Product Visionary",
                dimensions={
                    "market": 85,
                    "product": 90,
                    "gtm": 75,
                    "finance": 65,
                    "fundraising": 80,
                    "execution": 75
                },
                strengths=["Product & MVP (90% mastery)", "Market & Validation (85% mastery)"],
                blindspots=["Unit Economics & Finance (65% - priority focus area)"],
                recommended_courses=[
                    {
                        "id": 3,
                        "slug": "unit-economics-financial-modeling",
                        "title": "Startup Unit Economics: CAC, LTV & Financial Modeling",
                        "category": "Finance",
                        "difficulty": "Intermediate",
                        "duration": "4 hours",
                        "rating": 4.95,
                        "cover_tag": "Finance & Runway"
                    }
                ]
            )
            session.add(demo_assessment)
            await session.commit()
            print("[Init] Seeded initial course progress & founder assessment")

    yield
    await engine.dispose()

app = FastAPI(title="VentureEd - AI Startup Academy & Incubator API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "VentureEd API is running", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)