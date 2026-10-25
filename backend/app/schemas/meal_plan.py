from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MealPlanRequest(BaseModel):
    duration_days: int = Field(7, ge=1, le=14)
    dietary_preference: str = Field("Balanced", description="e.g. Balanced, Vegetarian, Vegan, Keto, Mediterranean, High Protein, Low Carb")
    allergies: List[str] = Field(default_factory=list, description="e.g. Dairy, Gluten, Peanuts, Shellfish")
    cuisine_preferences: List[str] = Field(default_factory=list, description="e.g. Italian, Asian, Mexican, Mediterranean")
    target_calories_daily: int = Field(2000, ge=1000, le=4500)
    budget_level: str = Field("Standard", description="Budget-Friendly, Standard, Gourmet")
    available_pantry: Optional[str] = Field("", description="List of items already in fridge/pantry")

class MealDish(BaseModel):
    id: str
    name: str
    meal_type: str = Field(..., description="Breakfast, Lunch, Dinner, Snack")
    calories: int
    protein_g: int
    carbs_g: int
    fats_g: int
    prep_time_minutes: int
    ingredients_summary: List[str]
    quick_recipe: str
    alternative_suggestion: Optional[str] = None

class DayMealPlan(BaseModel):
    day: str = Field(..., description="Day 1 (Monday), Day 2 (Tuesday), etc.")
    total_calories: int
    meals: List[MealDish]

class GroceryCategory(BaseModel):
    category: str = Field(..., description="Produce, Proteins, Dairy & Eggs, Pantry & Grains, Spices & Oils")
    items: List[str]

class MealPlanResponse(BaseModel):
    id: Optional[str] = None
    title: str
    dietary_type: str
    daily_calorie_target: int
    weekly_overview: str
    days: List[DayMealPlan]
    grocery_list: List[GroceryCategory]
    macro_targets: Dict[str, str] = Field(default_factory=dict)
    is_demo: bool = False
    ai_model_used: str = "Gemini AI"
    created_at: Optional[str] = None

class MealSwapRequest(BaseModel):
    meal_type: str
    current_dish: str
    dietary_preference: str
    target_calories: int
    avoid_ingredients: List[str] = []

class MealSwapResponse(BaseModel):
    replacement_dish: MealDish
    reason_for_swap: str
