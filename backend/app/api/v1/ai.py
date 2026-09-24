from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.project import Project
from app.models.lean_canvas import LeanCanvas
from app.schemas.lean_canvas import LeanCanvasResponse
from app.services.ai_service import ai_service, generate_fallback_swot
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class GenerateCanvasRequest(BaseModel):
    project_id: int
    idea_description: Optional[str] = None

@router.post("/generate-canvas", response_model=LeanCanvasResponse, status_code=status.HTTP_201_CREATED)
async def generate_canvas(request: GenerateCanvasRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).filter(Project.id == request.project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    desc = request.idea_description or project.idea_description
    ai_canvas_data = await ai_service.generate_lean_canvas(desc)

    # Update project feasibility & swot
    if not project.swot_analysis:
        project.swot_analysis = generate_fallback_swot(desc)
    if not project.feasibility_score:
        project.feasibility_score = 82
    db.add(project)

    result = await db.execute(select(LeanCanvas).filter(LeanCanvas.project_id == request.project_id))
    existing_canvas = result.scalars().first()

    if existing_canvas:
        for key, value in ai_canvas_data.items():
            setattr(existing_canvas, key, value)
        canvas_record = existing_canvas
    else:
        canvas_record = LeanCanvas(project_id=request.project_id, **ai_canvas_data)
        db.add(canvas_record)

    await db.commit()
    await db.refresh(canvas_record)
    return canvas_record

@router.post("/generate-canvas/{project_id}", response_model=LeanCanvasResponse, status_code=status.HTTP_201_CREATED)
async def generate_canvas_by_id(project_id: int, db: AsyncSession = Depends(get_db)):
    req = GenerateCanvasRequest(project_id=project_id)
    return await generate_canvas(req, db)

@router.get("/canvas/{project_id}", response_model=Optional[LeanCanvasResponse])
async def get_canvas(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LeanCanvas).filter(LeanCanvas.project_id == project_id))
    canvas = result.scalars().first()
    if not canvas:
        # Check if project exists, auto-generate if not created yet
        p_res = await db.execute(select(Project).filter(Project.id == project_id))
        proj = p_res.scalars().first()
        if proj:
            req = GenerateCanvasRequest(project_id=project_id, idea_description=proj.idea_description)
            return await generate_canvas(req, db)
        raise HTTPException(status_code=404, detail="Lean Canvas not found")
    return canvas