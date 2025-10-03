from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.schemas.User import ReadUser
from app.models.User import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=ReadUser)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
