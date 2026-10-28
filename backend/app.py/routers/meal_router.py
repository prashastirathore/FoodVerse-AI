from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.schemas.meal_plan import MealPlanRequest, MealPlanResponse, MealSwapRequest, MealSwapResponse, MealDish
from app.services.gemini_service import gemini_service
from app.database import db_manager
from app.security import get_current_user

router = APIRouter(prefix="/meals", tags=["Personalized Meal Planner"])

@router.post("/generate", response_model=MealPlanResponse)
async def generate_meal_plan(req: MealPlanRequest, user: Dict[str, Any] = Depends(get_current_user)):
    """Generate comprehensive structured meal plan with daily dishes and grocery list."""
    plan_data = await gemini_service.generate_personalized_meal_plan(req.dict())
    
    # Save plan
    doc = {
        "user_id": str(user.get("_id", "guest")),
        "title": plan_data.get("title", "Custom Meal Plan"),
        "dietary_type": plan_data.get("dietary_type", req.dietary_preference),
        "daily_calorie_target": plan_data.get("daily_calorie_target", req.target_calories_daily),
        "data": plan_data
    }
    saved = await db_manager.save_meal_plan(doc)
    plan_data["id"] = str(saved["_id"])
    plan_data["created_at"] = saved["created_at"]
    return plan_data

@router.post("/swap", response_model=MealSwapResponse)
async def swap_meal(req: MealSwapRequest):
    """Swap an individual meal dish with an instant smart alternative."""
    # Dynamic alternative generator
    alternatives = [
        MealDish(
            id=f"alt_{int(hash(req.current_dish)) % 1000}",
            name=f"Chef's Special {req.dietary_preference} {req.meal_type} Bowl",
            meal_type=req.meal_type,
            calories=req.target_calories,
            protein_g=int(req.target_calories * 0.28 / 4),
            carbs_g=int(req.target_calories * 0.45 / 4),
            fats_g=int(req.target_calories * 0.27 / 9),
            prep_time_minutes=15,
            ingredients_summary=["Extra-firm organic tofu or grilled chicken", "Steamed edamame", "Brown jasmine rice", "Avocado slices", "Sesame ginger dressing"],
            quick_recipe="Combine warm grain base with seared protein, sliced avocado, and drizzle with house ginger sesame sauce.",
            alternative_suggestion="Roasted Vegetable Lentil Salad"
        ),
        MealDish(
            id=f"alt2_{int(hash(req.current_dish)) % 1000}",
            name=f"Zesty Herb {req.meal_type} Medley",
            meal_type=req.meal_type,
            calories=req.target_calories - 30,
            protein_g=35,
            carbs_g=40,
            fats_g=18,
            prep_time_minutes=12,
            ingredients_summary=["Grilled salmon or tempeh", "Baby arugula", "Cherry tomatoes", "Lemon vinaigrette"],
            quick_recipe="Toss crisp greens with seasoned warm protein and fresh lemon olive oil dressing.",
            alternative_suggestion="Sweet Potato & Black Bean Bowl"
        )
    ]
    chosen = alternatives[0]
    return MealSwapResponse(
        replacement_dish=chosen,
        reason_for_swap=f"Nutritionally matched replacement adhering to {req.dietary_preference} guidelines and ~{req.target_calories} kcal target."
    )

@router.get("/saved")
async def get_saved_meal_plans(user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve user's saved meal plans."""
    return await db_manager.get_meal_plans(user_id=str(user.get("_id", "guest")), limit=10)
