from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class RegisterReq(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str | None = None


class RegisterResp(BaseModel):
    ok: bool


class LoginReq(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResp(BaseModel):
    token: str


class MeResp(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str | None = None
    created_at: datetime
