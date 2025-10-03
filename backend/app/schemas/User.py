# from typing import Optional, List, Dict
from pydantic import BaseModel
import uuid


class User(BaseModel):
    name: str
    email: str


class NewUserRequest(User):
    hashed_password: str


class NewUserResponse(User):
    id: uuid
