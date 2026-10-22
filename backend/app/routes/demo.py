from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Cycle, HealthLog, PregnancyProfile, AIInsight
from ..seed_data import seed_database

router = APIRouter(prefix="/api/demo", tags=["Demo & Data Management"])

@router.get("/status")
def get_data_status(db: Session = Depends(get_db)):
    user = db.query(User).first()
    cycle_count = db.query(Cycle).count()
    log_count = db.query(HealthLog).count()
    preg = db.query(PregnancyProfile).first()

    return {
        "user": {"name": user.name, "email": user.email} if user else None,
        "cycles_count": cycle_count,
        "health_logs_count": log_count,
        "pregnancy_active": preg.is_active if preg else False
    }

@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    return seed_database(db)

@router.post("/reset")
def reset_demo_data(db: Session = Depends(get_db)):
    db.query(HealthLog).delete()
    db.query(Cycle).delete()
    db.query(AIInsight).delete()
    preg = db.query(PregnancyProfile).first()
    if preg:
        preg.is_active = False
        preg.conception_date = None
        preg.last_period_date = None
        preg.due_date = None
        preg.notes = None
    db.commit()
    return {"status": "reset_complete", "message": "All cycle and health log records cleared."}
