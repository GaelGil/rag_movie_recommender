import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.db import get_db, SessionLocal
from app.models import User
from app.schemas.Common import (
    LoginRequest,
    LoginResponse,
    SignUpRequest,
    SignUpResponse,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db),
):
    db_user = User(**login_request.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return LoginResponse(id=db_user.id)


@router.get("/signup", response_model=SignUpResponse)
async def signup(signup_request: SignUpRequest, db: Session = Depends(get_db)):
    db_user = User(**signup_request.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return SignUpResponse(id=db_user.id)
