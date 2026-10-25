from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class VisibleSign(BaseModel):
    category: str = Field(..., description="e.g. Bruising, Discoloration, Mold Patterns, Wilting, Texture")
    observed: bool = Field(..., description="Whether this sign is visible in the image")
    severity: str = Field("None", description="None, Low, Moderate, Severe")
    details: str

class FreshnessAnalysisResponse(BaseModel):
    id: Optional[str] = None
    item_name: str
    category: str = Field("Produce", description="Fruit, Vegetable, Meat, Dairy, Bakery, Prepared")
    freshness_status: str = Field(..., description="Optimal Freshness, Consume Soon, Questionable Quality, Spoiled / High Risk")
    freshness_index: int = Field(..., ge=0, le=100, description="Freshness index from 0 (spoiled) to 100 (peak freshness)")
    confidence: float = Field(0.9, ge=0, le=1)
    estimated_shelf_life: str = Field(..., description="e.g. 3-4 days in refrigerator, Consume within 24 hours")
    visible_signs: List[VisibleSign] = Field(default_factory=list)
    observations: List[str] = Field(default_factory=list)
    storage_recommendation: str
    culinary_rescue_tips: Optional[str] = Field(None, description="Safe culinary tips if slightly overripe, e.g. smoothies, stocks")
    is_demo: bool = False
    ai_model_used: str = "Gemini Vision Multimodal"
    safety_disclaimer: str = "Safety Notice: Visual inspection by AI identifies surface patterns and visible degradation only. It cannot detect microscopic bacteria, foodborne pathogens, odorless toxins, or chemical contamination. When in doubt regarding odor, texture, or safety, discard the food."
    created_at: Optional[str] = None
