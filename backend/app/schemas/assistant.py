from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    dietary_preferences: Optional[List[str]] = []
    available_ingredients: Optional[List[str]] = []

class RecipeStep(BaseModel):
    step_number: int
    instruction: str
    duration_minutes: Optional[int] = None
    tip: Optional[str] = None

class IngredientItem(BaseModel):
    name: str
    amount: str
    substitution: Optional[str] = None

class RecipeData(BaseModel):
    title: str
    description: str
    cuisine: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    difficulty: str = "Medium"
    calories_per_serving: Optional[int] = None
    dietary_tags: List[str] = []
    ingredients: List[IngredientItem]
    steps: List[RecipeStep]
    chef_notes: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_recipe: Optional[RecipeData] = None
    substitutions: Optional[List[Dict[str, str]]] = []
    follow_up_suggestions: List[str] = []
    is_demo: bool = False
    ai_model_used: str = "Gemini AI"
