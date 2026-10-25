from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, Dict, Any, List
from app.schemas.nutrition import NutritionAnalysisResponse
from app.services.gemini_service import gemini_service
from app.database import db_manager
from app.security import get_current_user

router = APIRouter(prefix="/nutrition", tags=["Food Recognition & Nutrition"])

SAMPLE_DISHES = [
    {
        "id": "sample_salmon_bowl",
        "name": "Mediterranean Salmon & Quinoa Bowl",
        "category": "High Protein & Omega-3",
        "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "hint": "Pan-seared salmon fillet over herbed quinoa, roasted asparagus, cherry tomatoes, and tahini drizzle."
    },
    {
        "id": "sample_avocado_toast",
        "name": "Artisanal Avocado & Poached Egg Toast",
        "category": "Healthy Breakfast",
        "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
        "hint": "Sourdough toast with sliced avocado, free-range poached egg, chili flakes, and microgreens."
    },
    {
        "id": "sample_grilled_chicken_salad",
        "name": "Crisp Garden Salad with Grilled Chicken",
        "category": "Low Carb & Clean",
        "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        "hint": "Grilled herb chicken cutlets, mixed greens, cucumbers, heirloom tomatoes, and olive oil vinaigrette."
    }
]

@router.get("/samples")
async def get_sample_dishes():
    """Return pre-configured sample dishes for instantaneous testing."""
    return SAMPLE_DISHES

@router.post("/analyze", response_model=NutritionAnalysisResponse)
async def analyze_nutrition(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    prompt_hint: Optional[str] = Form(""),
    user: Dict[str, Any] = Depends(get_current_user)
):
    image_bytes = None
    hint = prompt_hint or ""
    
    if file:
        # Check size (limit 15MB)
        image_bytes = await file.read()
        if len(image_bytes) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image file too large (max 15MB).")
    elif sample_id:
        sample = next((s for s in SAMPLE_DISHES if s["id"] == sample_id), None)
        if sample:
            hint = f"{sample['name']} - {sample['hint']}"
    
    # Process through Gemini / Demo fallback
    result = await gemini_service.analyze_food_nutrition(image_bytes=image_bytes, prompt_hint=hint)
    
    # Save to history
    history_entry = {
        "user_id": str(user.get("_id", "guest")),
        "type": "nutrition",
        "title": result.get("title", "Food Nutrition Analysis"),
        "summary": result.get("summary", ""),
        "health_score": result.get("health_score", 85),
        "calories": result.get("macronutrients", {}).get("calories", 0),
        "is_demo": result.get("is_demo", False),
        "data": result
    }
    saved = await db_manager.save_history(history_entry)
    result["id"] = str(saved["_id"])
    result["created_at"] = saved["created_at"]
    
    return result

@router.get("/history")
async def get_nutrition_history(user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve user's food analysis history."""
    return await db_manager.get_history(user_id=str(user.get("_id", "guest")), scan_type="nutrition", limit=20)
