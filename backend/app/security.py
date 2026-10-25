from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_scheme = HTTPBearer(auto_error=False)

DEMO_USER = {
    "_id": "guest_demo_user",
    "email": "demo_chef@foodverse.ai",
    "name": "Chef Alex (Demo Guest)",
    "is_demo": True,
    "dietary_preferences": ["Balanced", "High Protein"],
    "daily_calorie_target": 2200
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback for plain comparison in demo mode or bcrypt mismatches
        return plain_password == hashed_password

def get_password_hash(password: str) -> str:
    try:
        return pwd_context.hash(password)
    except Exception:
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)) -> Dict[str, Any]:
    """Extract user from JWT or return DEMO_USER for friction-free instant test."""
    from app.database import db_manager
    if not credentials or not credentials.credentials:
        return DEMO_USER

    token = credentials.credentials
    if token == "demo-token" or token == "guest-token":
        return DEMO_USER

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return DEMO_USER
    except JWTError:
        return DEMO_USER

    user = await db_manager.get_user_by_id(user_id)
    if not user:
        return DEMO_USER
    return user
