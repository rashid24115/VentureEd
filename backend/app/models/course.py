from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Ideation, Product, Growth, Finance, Fundraising
    difficulty = Column(String, default="Beginner")  # Beginner, Intermediate, Advanced
    duration = Column(String, default="2 hours")
    rating = Column(Float, default=4.9)
    students_count = Column(Integer, default=1240)
    description = Column(Text, nullable=False)
    cover_tag = Column(String, default="Startup Strategy")
    icon_name = Column(String, default="BookOpen")
    syllabus = Column(JSON, default=list)  # list of modules with lessons
    quiz_data = Column(JSON, default=list)  # list of quiz questions
    created_at = Column(DateTime, default=datetime.utcnow)

    enrollments = relationship("CourseEnrollment", back_populates="course", cascade="all, delete-orphan")


class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress_percent = Column(Integer, default=0)
    completed_lessons = Column(JSON, default=list)  # list of lesson IDs completed
    quiz_completed = Column(Integer, default=0)  # 0 or 1
    quiz_score = Column(Integer, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    course = relationship("Course", back_populates="enrollments")


class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)
    answers_summary = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Integer, nullable=False)
    readiness_level = Column(String, nullable=False)
    archetype = Column(String, nullable=False)
    dimensions = Column(JSON, nullable=False)  # dict of 6 dimension scores
    strengths = Column(JSON, default=list)
    blindspots = Column(JSON, default=list)
    recommended_courses = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
