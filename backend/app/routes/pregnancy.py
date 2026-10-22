from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import PregnancyProfile, User
from ..schemas import PregnancyCreate, PregnancyResponse

router = APIRouter(prefix="/api/pregnancy", tags=["Pregnancy Mode"])

BABY_SIZES = {
    4: "Poppy Seed",
    6: "Sweet Pea",
    8: "Raspberry",
    10: "Prune",
    12: "Plum",
    14: "Lemon",
    16: "Avocado",
    18: "Bell Pepper",
    20: "Banana",
    22: "Papaya",
    24: "Corn on the Cob",
    26: "Zucchini",
    28: "Eggplant",
    30: "Cabbage",
    32: "Jicama",
    34: "Cantaloupe",
    36: "Honeydew Melon",
    38: "Winter Melon",
    40: "Small Pumpkin"
}

DISCLAIMER = (
    "HerCare AI Pregnancy Mode provides supportive wellness tracking, hydration suggestions, "
    "and general trimester milestones. It is NOT prenatal medical advice or diagnostic evaluation. "
    "Always consult with your obstetrician, certified midwife, or healthcare provider for maternal medical guidance."
)

def build_pregnancy_response(preg: PregnancyProfile) -> dict:
    today = date.today()
    current_week = None
    current_trimester = None
    days_remaining = None
    baby_size = None
    trimester_tips = []

    if preg.is_active:
        base_date = preg.last_period_date or (preg.conception_date - timedelta(days=14) if preg.conception_date else None)
        if base_date:
            days_pregnant = (today - base_date).days
            current_week = max(1, min(42, days_pregnant // 7 + 1))
            
            # Trimester
            if current_week <= 13:
                current_trimester = 1
                trimester_tips = [
                    "Nourish with folate and Vitamin B6 to help with early cell division and morning nausea.",
                    "Drink ginger or peppermint tea and eat small, frequent meals to settle your stomach.",
                    "Prioritize early evening rest as progesterone can cause significant daytime sleepiness."
                ]
            elif current_week <= 27:
                current_trimester = 2
                trimester_tips = [
                    "Your energy often rebounds in the second trimester; enjoy brisk walking and prenatal yoga.",
                    "Hydrate well to support blood volume expansion and prevent muscle cramps.",
                    "Incorporate calcium, magnesium, and vitamin D for baby's bone development."
                ]
            else:
                current_trimester = 3
                trimester_tips = [
                    "Rest with pillows supporting your back and between knees on your left side.",
                    "Practice slow, deep diaphragmatic breathing to prepare your nervous system for birth.",
                    "Stay hydrated and keep feet elevated when sitting to minimize lower limb swelling."
                ]

            # Approximate baby size
            closest_wk = min(BABY_SIZES.keys(), key=lambda w: abs(w - current_week))
            baby_size = BABY_SIZES[closest_wk]

            # Due date calculation
            calc_due = preg.due_date or (base_date + timedelta(days=280))
            days_remaining = max(0, (calc_due - today).days)

    return {
        "id": preg.id,
        "user_id": preg.user_id,
        "is_active": preg.is_active,
        "conception_date": preg.conception_date,
        "last_period_date": preg.last_period_date,
        "due_date": preg.due_date,
        "notes": preg.notes,
        "current_week": current_week,
        "current_trimester": current_trimester,
        "days_remaining": days_remaining,
        "baby_size": baby_size,
        "trimester_tips": trimester_tips,
        "disclaimer": DISCLAIMER,
        "updated_at": preg.updated_at
    }

@router.get("", response_model=PregnancyResponse)
def get_pregnancy_profile(db: Session = Depends(get_db)):
    preg = db.query(PregnancyProfile).first()
    if not preg:
        user = db.query(User).first()
        if not user:
            user = User(name="Sarah Chen", email="sarah@hercare.ai")
            db.add(user)
            db.commit()
            db.refresh(user)
        preg = PregnancyProfile(user_id=user.id, is_active=False)
        db.add(preg)
        db.commit()
        db.refresh(preg)
    return build_pregnancy_response(preg)

@router.post("", response_model=PregnancyResponse)
def update_pregnancy_profile(preg_in: PregnancyCreate, db: Session = Depends(get_db)):
    preg = db.query(PregnancyProfile).first()
    if not preg:
        user = db.query(User).first()
        if not user:
            user = User(name="Sarah Chen", email="sarah@hercare.ai")
            db.add(user)
            db.commit()
            db.refresh(user)
        preg = PregnancyProfile(user_id=user.id)
        db.add(preg)

    preg.is_active = preg_in.is_active
    preg.conception_date = preg_in.conception_date
    preg.last_period_date = preg_in.last_period_date
    
    if preg_in.due_date:
        preg.due_date = preg_in.due_date
    elif preg_in.last_period_date:
        preg.due_date = preg_in.last_period_date + timedelta(days=280)
    elif preg_in.conception_date:
        preg.due_date = preg_in.conception_date + timedelta(days=266)

    preg.notes = preg_in.notes
    db.commit()
    db.refresh(preg)
    return build_pregnancy_response(preg)
