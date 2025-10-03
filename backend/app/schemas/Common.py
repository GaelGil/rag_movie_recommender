from pydantic import BaseModel, EmailStr
import uuid


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class SignUpResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
