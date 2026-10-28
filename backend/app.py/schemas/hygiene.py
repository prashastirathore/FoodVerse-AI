from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HygieneFinding(BaseModel):
    area: str = Field(..., description="e.g. Food Prep Station, Cutting Surface, Floor, Cooktop, Refrigeration, Handwash Station")
    issue: str = Field(..., description="Observed cleanliness issue or risk")
    severity: str = Field(..., description="Low, Medium, High, Critical")
    description: str

class CorrectiveAction(BaseModel):
    priority: str = Field(..., description="Immediate, High, Routine")
    action: str = Field(..., description="Specific corrective measure")
    target_timeline: str = Field(..., description="e.g. Within 1 hour, End of shift, Daily protocol")

class ChecklistCategory(BaseModel):
    category_name: str
    status: str = Field("Pass", description="Pass, Minor Issue, Fail")
    score: int = Field(100, ge=0, le=100)
    notes: str

class HygieneAuditResponse(BaseModel):
    id: Optional[str] = None
    location_name: Optional[str] = "Main Kitchen Preparation Area"
    overall_score: int = Field(..., ge=0, le=100, description="Overall hygiene score out of 100")
    grade: str = Field(..., description="Grade A (90-100), Grade B (80-89), Grade C (70-79), Needs Attention (<70)")
    risk_level: str = Field(..., description="Low Risk, Moderate Risk, Elevated Risk, Critical Risk")
    executive_summary: str
    checklist_breakdown: List[ChecklistCategory] = Field(default_factory=list)
    findings: List[HygieneFinding] = Field(default_factory=list)
    corrective_actions: List[CorrectiveAction] = Field(default_factory=list)
    positive_observations: List[str] = Field(default_factory=list)
    is_demo: bool = False
    ai_model_used: str = "Gemini Vision Multimodal"
    audit_disclaimer: str = "Audit Advisory: This automated optical analysis is an assistive monitoring tool based solely on photographic evidence. It does not replace official local health department certifications, microbiological swab tests, or comprehensive on-site inspections."
    created_at: Optional[str] = None
