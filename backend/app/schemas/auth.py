from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    dietary_preferences: Optional[List[str]] = []
    daily_calorie_target: Optional[int] = 2000

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    daily_calorie_target: Optional[int] = None
    gemini_api_key: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    is_demo: bool = False
    dietary_preferences: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    daily_calorie_target: Optional[int] = 2000

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
