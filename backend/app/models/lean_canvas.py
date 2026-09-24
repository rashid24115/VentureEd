from sqlalchemy import Column, String, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class LeanCanvas(Base):
    __tablename__ = "lean_canvases"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    problem = Column(JSON, default=list)
    solution = Column(JSON, default=list)
    key_metrics = Column(JSON, default=list)
    unique_value_proposition = Column(String, default="")
    unfair_advantage = Column(String, default="")
    channels = Column(JSON, default=list)
    customer_segments = Column(JSON, default=list)
    cost_structure = Column(JSON, default=list)
    revenue_streams = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="lean_canvas")