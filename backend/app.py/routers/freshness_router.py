from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, Dict, Any, List
from app.schemas.freshness import FreshnessAnalysisResponse
from app.services.gemini_service import gemini_service
from app.database import db_manager
from app.security import get_current_user

router = APIRouter(prefix="/freshness", tags=["Food Freshness Detection"])

SAMPLE_FRESHNESS_ITEMS = [
    {
        "id": "sample_apple",
        "name": "Fresh Honeycrisp Apple",
        "category": "Fruit",
        "status_preview": "Optimal Freshness (Index 95/100)",
        "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "hint": "Crisp red and yellow Honeycrisp apple with taut skin and intact stem."
    },
    {
        "id": "sample_banana",
        "name": "Ripe Cavendish Bananas",
        "category": "Fruit",
        "status_preview": "Consume Soon (Sugar Freckling)",
        "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
        "hint": "Bananas showing brown sugar freckles and slight stem dehydration."
    },
    {
        "id": "sample_spinach",
        "name": "Baby Spinach Leaves",
        "category": "Vegetables",
        "status_preview": "Optimal Freshness (Crisp & Turgid)",
        "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
        "hint": "Organic baby spinach leaves with deep chlorophyll green hue and no yellowing."
    }
]

@router.get("/samples")
async def get_freshness_samples():
    """Return pre-configured food samples for freshness testing."""
    return SAMPLE_FRESHNESS_ITEMS

@router.post("/analyze", response_model=FreshnessAnalysisResponse)
async def analyze_freshness(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    item_hint: Optional[str] = Form(""),
    user: Dict[str, Any] = Depends(get_current_user)
):
    image_bytes = None
    hint = item_hint or ""
    
    if file:
        image_bytes = await file.read()
        if len(image_bytes) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image file too large (max 15MB).")
    elif sample_id:
        sample = next((s for s in SAMPLE_FRESHNESS_ITEMS if s["id"] == sample_id), None)
        if sample:
            hint = f"{sample['name']} - {sample['hint']}"
    
    result = await gemini_service.analyze_food_freshness(image_bytes=image_bytes, item_hint=hint)
    
    # Save to history
    history_entry = {
        "user_id": str(user.get("_id", "guest")),
        "type": "freshness",
        "title": f"Freshness: {result.get('item_name', 'Food Item')}",
        "summary": f"Status: {result.get('freshness_status')} | Score: {result.get('freshness_index')}/100",
        "health_score": result.get("freshness_index", 80),
        "is_demo": result.get("is_demo", False),
        "data": result
    }
    saved = await db_manager.save_history(history_entry)
    result["id"] = str(saved["_id"])
    result["created_at"] = saved["created_at"]
    
    return result

@router.get("/history")
async def get_freshness_history(user: Dict[str, Any] = Depends(get_current_user)):
    return await db_manager.get_history(user_id=str(user.get("_id", "guest")), scan_type="freshness", limit=20)
