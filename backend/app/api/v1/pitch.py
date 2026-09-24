from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.pitch_session import PitchSession
from app.schemas.pitch import StartPitchRequest, PitchMessageRequest, PitchSessionResponse, PitchMessageResponse
from app.services.pitch_service import pitch_service

router = APIRouter()

@router.post("/session/start", response_model=PitchSessionResponse, status_code=status.HTTP_201_CREATED)
async def start_session(req: StartPitchRequest, db: AsyncSession = Depends(get_db)):
    new_session = PitchSession(
        project_id=req.project_id,
        persona=req.persona,
        chat_history=[{"sender": "ai_vc", "message": "Welcome! Pitch me your startup idea.", "rating": None, "criticismTag": None}]
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session

@router.post("/session/{session_id}/chat", response_model=PitchMessageResponse)
async def pitch_chat(session_id: int, req: PitchMessageRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PitchSession).filter(PitchSession.id == session_id))
    session = result.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    history = list(session.chat_history or [])
    history.append({"sender": "user", "message": req.message, "rating": None, "criticismTag": None})

    ai_response = await pitch_service.get_persona_reply(session.persona, req.message, history)
    history.append(ai_response.model_dump())
    session.chat_history = history

    db.add(session)
    await db.commit()
    return ai_response