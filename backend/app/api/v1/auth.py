from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.database import get_db
from app.models.user import User
from app.models.course import CourseEnrollment, AssessmentResult
from app.core.security import verify_password, get_password_hash, create_access_token
from jose import JWTError, jwt
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    xp: int
    streak: int
    enrolled_count: int = 0
    quizzes_count: int = 0
    readiness_score: Optional[int] = None
    archetype: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: UserProfileResponse

async def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Optional[User]:
    if not token:
        # Fallback to demo user if no token
        result = await db.execute(select(User).filter(User.id == 1))
        return result.scalars().first()
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = int(payload.get("sub"))
        result = await db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        return user
    except Exception:
        result = await db.execute(select(User).filter(User.id == 1))
        return result.scalars().first()

@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = User(
        name=req.name,
        email=req.email,
        password_hash=get_password_hash(req.password),
        xp=100,
        streak=1
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    return AuthResponse(
        token=token,
        user=UserProfileResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            xp=new_user.xp,
            streak=new_user.streak,
            enrolled_count=0,
            quizzes_count=0,
            readiness_score=None,
            archetype=None
        )
    )

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    
    # Allow demo login shortcut or check password
    if not user:
        if req.email == "demo@ventureai.com":
            # Auto-create if not present
            user = User(id=1, name="Alex Rivera (Founder)", email="demo@ventureai.com", password_hash=get_password_hash("venture123"), xp=280, streak=5)
            db.add(user)
            await db.commit()
            await db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # If standard user, verify password (or demo password bypass)
    if req.email != "demo@ventureai.com" or req.password != "venture123":
        if not verify_password(req.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

    # Fetch stats
    enrollments_res = await db.execute(select(CourseEnrollment).filter(CourseEnrollment.user_id == user.id))
    enrollments = enrollments_res.scalars().all()
    enrolled_count = len(enrollments)
    quizzes_count = sum(1 for e in enrollments if e.quiz_completed)

    assessment_res = await db.execute(select(AssessmentResult).filter(AssessmentResult.user_id == user.id).order_by(AssessmentResult.id.desc()))
    last_assessment = assessment_res.scalars().first()

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return AuthResponse(
        token=token,
        user=UserProfileResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            xp=user.xp,
            streak=user.streak,
            enrolled_count=enrolled_count,
            quizzes_count=quizzes_count,
            readiness_score=last_assessment.overall_score if last_assessment else None,
            archetype=last_assessment.archetype if last_assessment else None
        )
    )

@router.get("/me", response_model=UserProfileResponse)
async def get_me(user: User = Depends(get_current_user_optional), db: AsyncSession = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    enrollments_res = await db.execute(select(CourseEnrollment).filter(CourseEnrollment.user_id == user.id))
    enrollments = enrollments_res.scalars().all()
    enrolled_count = len(enrollments)
    quizzes_count = sum(1 for e in enrollments if e.quiz_completed)

    assessment_res = await db.execute(select(AssessmentResult).filter(AssessmentResult.user_id == user.id).order_by(AssessmentResult.id.desc()))
    last_assessment = assessment_res.scalars().first()

    return UserProfileResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        xp=user.xp,
        streak=user.streak,
        enrolled_count=enrolled_count,
        quizzes_count=quizzes_count,
        readiness_score=last_assessment.overall_score if last_assessment else None,
        archetype=last_assessment.archetype if last_assessment else None
    )
