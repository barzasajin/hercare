from datetime import date, datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Cycle Schemas ---
class CycleBase(BaseModel):
    start_date: date
    end_date: Optional[date] = None
    cycle_length: int = Field(default=28, ge=18, le=60)
    period_duration: int = Field(default=5, ge=1, le=14)
    flow_intensity: str = Field(default="medium", pattern="^(light|medium|heavy)$")
    notes: Optional[str] = None

class CycleCreate(CycleBase):
    pass

class CycleResponse(CycleBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CyclePrediction(BaseModel):
    next_period_start: date
    next_period_end: date
    ovulation_date: date
    fertile_window_start: date
    fertile_window_end: date
    estimated_cycle_length: int
    current_cycle_day: int
    current_phase: str
    confidence_score: float # 0.0 to 1.0
    confidence_level: str # Low, Moderate, High
    is_estimate: bool = True
    disclaimer: str
    total_historical_cycles: int

# --- Health Log Schemas ---
class HealthLogBase(BaseModel):
    log_date: date
    period_flow: str = Field(default="none", pattern="^(none|spotting|light|medium|heavy)$")
    pain_level: int = Field(default=0, ge=0, le=10)
    pain_types: List[str] = []
    mood: str = Field(default="calm", pattern="^(happy|calm|energetic|anxious|sad|irritable|mood_swings)$")
    energy_level: int = Field(default=5, ge=1, le=10)
    sleep_hours: float = Field(default=7.5, ge=0.0, le=24.0)
    sleep_quality: str = Field(default="good", pattern="^(poor|fair|good|excellent)$")
    symptoms: List[str] = []
    notes: Optional[str] = None

class HealthLogCreate(HealthLogBase):
    pass

class HealthLogResponse(HealthLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Pregnancy Schemas ---
class PregnancyBase(BaseModel):
    is_active: bool = False
    conception_date: Optional[date] = None
    last_period_date: Optional[date] = None
    due_date: Optional[date] = None
    notes: Optional[str] = None

class PregnancyCreate(PregnancyBase):
    pass

class PregnancyResponse(PregnancyBase):
    id: int
    user_id: int
    current_week: Optional[int] = None
    current_trimester: Optional[int] = None
    days_remaining: Optional[int] = None
    baby_size: Optional[str] = None
    trimester_tips: List[str] = []
    disclaimer: str
    updated_at: datetime

    class Config:
        from_attributes = True

# --- AI & Analytics Schemas ---
class AIInsightItem(BaseModel):
    category: str
    title: str
    summary: str
    impact_level: str # 'positive', 'neutral', 'attention'
    confidence: float
    scientific_context: Optional[str] = None

class AIPatternItem(BaseModel):
    feature_pair: str
    correlation_score: float
    description: str
    significance: str # High, Moderate, Subtle
    recommendation: str

class AIChangeMetric(BaseModel):
    metric: str
    baseline_value: float
    recent_value: float
    delta: float
    direction: str # increased, decreased, stable
    is_significant: bool
    summary_text: str

class AIChangeReport(BaseModel):
    analysis_period: str
    changes: List[AIChangeMetric]
    overall_summary: str
    non_alarmist_advice: str

class AIRecommendationItem(BaseModel):
    id: str
    category: str # hydration, sleep, nutrition, relaxation, cycle_support
    title: str
    advice: str
    phase_relevance: str
    action_item: str
    supportive_quote: str
