from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    idea_description = Column(Text, nullable=False)
    industry_category = Column(String, default="General Tech")
    feasibility_score = Column(Integer, nullable=True)
    swot_analysis = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    lean_canvas = relationship("LeanCanvas", back_populates="project", uselist=False, cascade="all, delete-orphan")
    pitch_sessions = relationship("PitchSession", back_populates="project", cascade="all, delete-orphan")