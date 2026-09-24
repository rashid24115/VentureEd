from fastapi import APIRouter
from app.api.v1 import auth, courses, quizzes, assessment, projects, ai, pitch, copilot

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(assessment.router, prefix="/assessment", tags=["Knowledge Strength Diagnostic"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["AI Startup Co-Pilot"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Engines"])
api_router.include_router(pitch.router, prefix="/pitch", tags=["Pitch Simulator"])