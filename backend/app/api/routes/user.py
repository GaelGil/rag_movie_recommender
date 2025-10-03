from fastapi import APIRouter, Depends

# from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import User


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def read_users_me(current_user: User = Depends(get_db)):
    return current_user
