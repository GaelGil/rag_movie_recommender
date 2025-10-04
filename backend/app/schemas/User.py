from __future__ import annotations
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class ReadUser(UserBase):
    id: uuid.UUID
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
