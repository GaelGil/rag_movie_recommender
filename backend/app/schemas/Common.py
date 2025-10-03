from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginResponse(BaseModel):
    name: str
    email: str


class SignUpResponse(BaseModel):
    name: str
    email: str
