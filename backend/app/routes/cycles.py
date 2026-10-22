from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Cycle, User
from ..schemas import CycleCreate, CycleResponse, CyclePrediction
from ..ml.cycle_predictor import predict_cycle

router = APIRouter(prefix="/api/cycles", tags=["Cycles"])

@router.get("", response_model=List[CycleResponse])
def get_cycles(db: Session = Depends(get_db)):
    cycles = db.query(Cycle).order_by(Cycle.start_date.desc()).all()
    return cycles

@router.post("", response_model=CycleResponse)
def create_cycle(cycle_in: CycleCreate, db: Session = Depends(get_db)):
    # Default user
    user = db.query(User).first()
    if not user:
        user = User(name="Sarah Chen", email="sarah@hercare.ai")
        db.add(user)
        db.commit()
        db.refresh(user)

    new_cycle = Cycle(
        user_id=user.id,
        start_date=cycle_in.start_date,
        end_date=cycle_in.end_date,
        cycle_length=cycle_in.cycle_length,
        period_duration=cycle_in.period_duration,
        flow_intensity=cycle_in.flow_intensity,
        notes=cycle_in.notes
    )
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)
    return new_cycle

@router.delete("/{cycle_id}")
def delete_cycle(cycle_id: int, db: Session = Depends(get_db)):
    c = db.query(Cycle).filter(Cycle.id == cycle_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cycle not found")
    db.delete(c)
    db.commit()
    return {"status": "deleted", "id": cycle_id}

@router.get("/prediction", response_model=CyclePrediction)
def get_cycle_prediction(db: Session = Depends(get_db)):
    cycles = db.query(Cycle).all()
    prediction = predict_cycle(cycles)
    return prediction
