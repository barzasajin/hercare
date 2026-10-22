import json
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import HealthLog, User
from ..schemas import HealthLogCreate, HealthLogResponse

router = APIRouter(prefix="/api/health-log", tags=["Health Logs"])

def serialize_log(log: HealthLog) -> dict:
    pain_types = []
    if log.pain_types:
        try:
            pain_types = json.loads(log.pain_types) if isinstance(log.pain_types, str) else log.pain_types
        except Exception:
            pain_types = [s.strip() for s in str(log.pain_types).split(",") if s.strip()]

    symptoms = []
    if log.symptoms:
        try:
            symptoms = json.loads(log.symptoms) if isinstance(log.symptoms, str) else log.symptoms
        except Exception:
            symptoms = [s.strip() for s in str(log.symptoms).split(",") if s.strip()]

    return {
        "id": log.id,
        "user_id": log.user_id,
        "log_date": log.log_date,
        "period_flow": log.period_flow,
        "pain_level": log.pain_level,
        "pain_types": pain_types,
        "mood": log.mood,
        "energy_level": log.energy_level,
        "sleep_hours": log.sleep_hours,
        "sleep_quality": log.sleep_quality,
        "symptoms": symptoms,
        "notes": log.notes,
        "created_at": log.created_at
    }

@router.get("", response_model=List[HealthLogResponse])
def get_health_logs(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    logs = db.query(HealthLog).order_by(HealthLog.log_date.desc()).limit(limit).all()
    return [serialize_log(l) for l in logs]

@router.get("/today", response_model=Optional[HealthLogResponse])
def get_today_log(db: Session = Depends(get_db)):
    today = date.today()
    log = db.query(HealthLog).filter(HealthLog.log_date == today).first()
    if not log:
        return None
    return serialize_log(log)

@router.post("", response_model=HealthLogResponse)
def create_or_update_health_log(log_in: HealthLogCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(name="Sarah Chen", email="sarah@hercare.ai")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check if entry exists for this date
    existing = db.query(HealthLog).filter(
        HealthLog.user_id == user.id,
        HealthLog.log_date == log_in.log_date
    ).first()

    p_types_json = json.dumps(log_in.pain_types)
    sym_json = json.dumps(log_in.symptoms)

    if existing:
        existing.period_flow = log_in.period_flow
        existing.pain_level = log_in.pain_level
        existing.pain_types = p_types_json
        existing.mood = log_in.mood
        existing.energy_level = log_in.energy_level
        existing.sleep_hours = log_in.sleep_hours
        existing.sleep_quality = log_in.sleep_quality
        existing.symptoms = sym_json
        existing.notes = log_in.notes
        db.commit()
        db.refresh(existing)
        return serialize_log(existing)
    else:
        new_log = HealthLog(
            user_id=user.id,
            log_date=log_in.log_date,
            period_flow=log_in.period_flow,
            pain_level=log_in.pain_level,
            pain_types=p_types_json,
            mood=log_in.mood,
            energy_level=log_in.energy_level,
            sleep_hours=log_in.sleep_hours,
            sleep_quality=log_in.sleep_quality,
            symptoms=sym_json,
            notes=log_in.notes
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return serialize_log(new_log)

@router.delete("/{log_id}")
def delete_health_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(HealthLog).filter(HealthLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log entry not found")
    db.delete(log)
    db.commit()
    return {"status": "deleted", "id": log_id}
