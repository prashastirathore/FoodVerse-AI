from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Macronutrients(BaseModel):
    calories: float = Field(..., description="Estimated total calories (kcal)")
    protein_g: float = Field(..., description="Protein in grams")
    carbohydrates_g: float = Field(..., description="Carbohydrates in grams")
    fats_g: float = Field(..., description="Fats in grams")
    fiber_g: float = Field(..., description="Dietary fiber in grams")
    sugar_g: Optional[float] = 0.0
    sodium_mg: Optional[float] = 0.0

class IdentifiedFoodItem(BaseModel):
    name: str
    portion_size: str
    estimated_weight_g: float
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    fiber_g: float
    glycemic_index: Optional[str] = "Medium"
    confidence_score: float = Field(0.9, ge=0, le=1)

class NutritionAnalysisResponse(BaseModel):
    id: Optional[str] = None
    title: str
    summary: str
    health_score: int = Field(..., ge=0, le=100, description="Healthiness score out of 100")
    dietary_classification: List[str] = Field(default_factory=list, description="e.g. High Protein, Keto-friendly, Vegan")
    macronutrients: Macronutrients
    micronutrients: Dict[str, str] = Field(default_factory=dict, description="e.g. Vitamin C, Iron, Calcium")
    items: List[IdentifiedFoodItem] = Field(default_factory=list)
    insights: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    is_demo: bool = False
    ai_model_used: str = "Gemini Vision Multimodal"
    disclaimer: str = "Important Notice: Nutritional values and portion measurements are approximate visual AI estimates and should not be used as clinical medical or strict dietary advice."
    created_at: Optional[str] = None
