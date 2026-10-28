from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, Dict, Any, List
from app.schemas.hygiene import HygieneAuditResponse
from app.services.gemini_service import gemini_service
from app.database import db_manager
from app.security import get_current_user

router = APIRouter(prefix="/hygiene", tags=["Restaurant & Kitchen Hygiene"])

SAMPLE_KITCHEN_AREAS = [
    {
        "id": "sample_prep_station",
        "name": "Commercial Stainless Prep Station",
        "category": "Prep Counter",
        "status_preview": "Grade B (Score 88/100)",
        "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
        "hint": "Stainless steel commercial prep line with cutting board, storage shelf, and sink."
    },
    {
        "id": "sample_grill_line",
        "name": "Restaurant Line Cook & Grill Area",
        "category": "Cook Line",
        "status_preview": "Grade A (Score 94/100)",
        "image_url": "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=800&q=80",
        "hint": "Commercial exhaust hood, polished stainless surfaces, clean cooking line."
    },
    {
        "id": "sample_home_kitchen",
        "name": "Residential Open Food Prep Kitchen",
        "category": "Home Kitchen",
        "status_preview": "Grade A (Score 96/100)",
        "image_url": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        "hint": "Sanitized quartz countertops, organized dish rack, clear food preparation zones."
    }
]

@router.get("/samples")
async def get_hygiene_samples():
    """Return pre-configured sample kitchen images for instant audit testing."""
    return SAMPLE_KITCHEN_AREAS

@router.post("/audit", response_model=HygieneAuditResponse)
async def audit_hygiene(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    location_hint: Optional[str] = Form(""),
    user: Dict[str, Any] = Depends(get_current_user)
):
    image_bytes = None
    hint = location_hint or ""
    
    if file:
        image_bytes = await file.read()
        if len(image_bytes) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image file too large (max 15MB).")
    elif sample_id:
        sample = next((s for s in SAMPLE_KITCHEN_AREAS if s["id"] == sample_id), None)
        if sample:
            hint = f"{sample['name']} - {sample['hint']}"
    
    result = await gemini_service.audit_kitchen_hygiene(image_bytes=image_bytes, location_hint=hint)
    
    history_entry = {
        "user_id": str(user.get("_id", "guest")),
        "type": "hygiene",
        "title": f"Hygiene Audit: {result.get('location_name', 'Kitchen Area')}",
        "summary": f"{result.get('grade')} | Score: {result.get('overall_score')}/100",
        "health_score": result.get("overall_score", 85),
        "is_demo": result.get("is_demo", False),
        "data": result
    }
    saved = await db_manager.save_history(history_entry)
    result["id"] = str(saved["_id"])
    result["created_at"] = saved["created_at"]
    
    return result

@router.get("/history")
async def get_hygiene_history(user: Dict[str, Any] = Depends(get_current_user)):
    return await db_manager.get_history(user_id=str(user.get("_id", "guest")), scan_type="hygiene", limit=20)
