from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.User import User
from app.schemas.Common import (
    LoginRequest,
    TokenResponse,
    SignUpRequest,
    SignUpResponse,
)
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.core.config import settings


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup", response_model=SignUpResponse, status_code=status.HTTP_201_CREATED
)
def signup(signup_request: SignUpRequest, db: Session = Depends(get_db)):
    # check existing user
    existing = db.query(User).filter(User.email == signup_request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed = get_password_hash(signup_request.password)
    db_user = User(
        name=signup_request.name, email=signup_request.email, hashed_password=hashed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return SignUpResponse(id=db_user.id, name=db_user.name, email=db_user.email)


@router.post("/login", response_model=TokenResponse)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_request.email).first()
    if not user or not verify_password(login_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    return TokenResponse(access_token=access_token, token_type="bearer")
