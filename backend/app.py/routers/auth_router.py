from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse, UserProfileUpdate
from app.database import db_manager
from app.security import get_password_hash, verify_password, create_access_token, get_current_user, DEMO_USER
from app.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/auth", tags=["Authentication & User"])

@router.post("/register", response_model=TokenResponse)
async def register(req: UserRegister):
    existing = await db_manager.get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    hashed_pwd = get_password_hash(req.password)
    user_doc = {
        "name": req.name,
        "email": req.email,
        "password": hashed_pwd,
        "dietary_preferences": req.dietary_preferences or ["Balanced"],
        "allergies": [],
        "daily_calorie_target": req.daily_calorie_target or 2000,
        "is_demo": False
    }
    created = await db_manager.create_user(user_doc)
    token = create_access_token({"sub": created["_id"], "email": created["email"]})
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=str(created["_id"]),
            name=created["name"],
            email=created["email"],
            dietary_preferences=created.get("dietary_preferences", []),
            allergies=created.get("allergies", []),
            daily_calorie_target=created.get("daily_calorie_target", 2000),
            is_demo=False
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLogin):
    user = await db_manager.get_user_by_email(req.email)
    if not user or not verify_password(req.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            dietary_preferences=user.get("dietary_preferences", []),
            allergies=user.get("allergies", []),
            daily_calorie_target=user.get("daily_calorie_target", 2000),
            is_demo=False
        )
    )

@router.post("/demo-guest", response_model=TokenResponse)
async def login_demo_guest():
    """One-click instant login for reviewers and demo mode testing."""
    token = create_access_token({"sub": DEMO_USER["_id"], "email": DEMO_USER["email"]})
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=DEMO_USER["_id"],
            name=DEMO_USER["name"],
            email=DEMO_USER["email"],
            dietary_preferences=DEMO_USER["dietary_preferences"],
            allergies=[],
            daily_calorie_target=DEMO_USER["daily_calorie_target"],
            is_demo=True
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return UserResponse(
        id=str(user.get("_id", "guest")),
        name=user.get("name", "Chef Alex"),
        email=user.get("email", "guest@foodverse.ai"),
        dietary_preferences=user.get("dietary_preferences", ["Balanced"]),
        allergies=user.get("allergies", []),
        daily_calorie_target=user.get("daily_calorie_target", 2000),
        is_demo=user.get("is_demo", False)
    )

@router.get("/status")
async def get_system_status():
    """Return backend status, Gemini live AI availability, and database state."""
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_live_ai": gemini_service.is_live_ai_available(),
        "gemini_model": settings.GEMINI_MODEL,
        "database_mode": "MongoDB (Native)" if (db_manager.connected and not db_manager.use_fallback) else "Resilient File/Memory Store",
        "demo_mode_active": not gemini_service.is_live_ai_available()
    }

@router.post("/configure-gemini-key")
async def configure_gemini_key(payload: Dict[str, str], user: Dict[str, Any] = Depends(get_current_user)):
    """Allow user to update Gemini API Key dynamically from the frontend settings UI."""
    key = payload.get("api_key", "").strip()
    if key:
        gemini_service.update_api_key(key)
        return {"success": True, "message": "Gemini API key updated successfully! Live multimodal AI active.", "gemini_live_ai": True}
    else:
        gemini_service.update_api_key("")
        return {"success": True, "message": "Reset to Demo Simulation Mode.", "gemini_live_ai": False}
