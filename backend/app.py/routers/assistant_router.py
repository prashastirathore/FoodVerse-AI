from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.schemas.assistant import ChatRequest, ChatResponse, RecipeData
from app.services.gemini_service import gemini_service
from app.database import db_manager
from app.security import get_current_user

router = APIRouter(prefix="/assistant", tags=["Smart Cooking Assistant"])

QUICK_PROMPT_CHIPS = [
    "Quick 20-minute high-protein dinner with chicken",
    "Best dairy-free substitute for heavy cream in soups",
    "Healthy snack under 200 calories using oats & peanut butter",
    "What can I cook with eggs, spinach, and sourdough?",
    "How to properly temper chocolate without seizing?"
]

@router.get("/prompts")
async def get_quick_prompts():
    """Return inspirational cooking and substitution prompts."""
    return QUICK_PROMPT_CHIPS

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest, user: Dict[str, Any] = Depends(get_current_user)):
    """Interactive culinary AI chat with recipes, substitutions, and step-by-step cooking."""
    prefs = req.dietary_preferences or user.get("dietary_preferences", [])
    history_dicts = [m.dict() for m in req.conversation_history] if req.conversation_history else []
    
    result = await gemini_service.cooking_assistant_chat(
        message=req.message,
        conversation_history=history_dicts,
        dietary_preferences=prefs,
        available_ingredients=req.available_ingredients or []
    )
    return result

@router.post("/recipe/save")
async def save_recipe(recipe: Dict[str, Any], user: Dict[str, Any] = Depends(get_current_user)):
    """Save an AI-generated recipe to user's personal cookbook."""
    recipe_doc = {
        "user_id": str(user.get("_id", "guest")),
        **recipe
    }
    saved = await db_manager.save_recipe(recipe_doc)
    return {"success": True, "recipe_id": str(saved["_id"]), "message": f"Recipe '{recipe.get('title')}' saved!"}

@router.get("/recipes")
async def get_saved_recipes(user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve user's saved recipes."""
    return await db_manager.get_recipes(user_id=str(user.get("_id", "guest")))

@router.delete("/recipe/{recipe_id}")
async def delete_saved_recipe(recipe_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    """Delete a recipe from user's cookbook."""
    deleted = await db_manager.delete_recipe(recipe_id=recipe_id, user_id=str(user.get("_id", "guest")))
    if not deleted:
        raise HTTPException(status_code=404, detail="Recipe not found or unauthorized.")
    return {"success": True, "message": "Recipe removed."}
