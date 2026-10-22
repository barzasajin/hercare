from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import Cycle, HealthLog, PregnancyProfile
from ..ml.cycle_predictor import predict_cycle
from ..ml.pattern_engine import detect_patterns
from ..ml.change_detector import detect_changes
from ..ml.recommender import generate_recommendations
import numpy as np

router = APIRouter(prefix="/api/ai", tags=["AI & Analytics"])

@router.get("/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    cycles = db.query(Cycle).all()
    logs = db.query(HealthLog).all()
    preg = db.query(PregnancyProfile).filter(PregnancyProfile.is_active == True).first()

    pred = predict_cycle(cycles)
    patterns = detect_patterns(logs, cycles)

    insights = []

    # 1. Cycle regularity insight
    if len(cycles) >= 2:
        lengths = [c.cycle_length for c in cycles if c.cycle_length]
        std = float(np.std(lengths))
        if std <= 1.5:
            insights.append({
                "category": "Cycle Rhythm",
                "title": "Remarkable Cycle Regularity",
                "summary": f"Your historical cycles show high stability (variance ±{round(std, 1)} days), placing you within a highly predictable rhythm.",
                "impact_level": "positive",
                "confidence": 0.92,
                "scientific_context": "Stable cycle lengths reflect healthy follicular development and consistent hypothalamic-pituitary-ovarian communication."
            })
        else:
            insights.append({
                "category": "Cycle Rhythm",
                "title": "Natural Cycle Fluidity",
                "summary": f"Your cycle length exhibits natural variation of ±{round(std, 1)} days across recorded cycles.",
                "impact_level": "neutral",
                "confidence": 0.78,
                "scientific_context": "Cycle lengths often shift by 2-4 days between months due to subtle changes in cortisol, work stress, travel, or nutritional timing."
            })

    # 2. Phase-specific hormonal insight
    current_phase = pred.get("current_phase", "Follicular Phase")
    if current_phase == "Menstrual Phase":
        insights.append({
            "category": "Biological Phase",
            "title": "Uterine Renewal & Low Estrogen",
            "summary": "Progesterone and estrogen have dropped to baseline, triggering the shedding of the uterine lining and promoting deep cellular rest.",
            "impact_level": "neutral",
            "confidence": 0.95,
            "scientific_context": "Resting metabolism decreases slightly during menstruation; prioritize warmth, sleep, and iron-dense nourishment."
        })
    elif current_phase == "Follicular Phase":
        insights.append({
            "category": "Biological Phase",
            "title": "Estrogen Rising & Cognitive Clarity",
            "summary": "FSH stimulates follicles in the ovary, gently lifting systemic estrogen and boosting natural motivation and mental alertness.",
            "impact_level": "positive",
            "confidence": 0.94,
            "scientific_context": "Rising estradiol enhances neuroplasticity and insulin sensitivity, making this an ideal phase for complex learning and physical exercise."
        })
    elif current_phase == "Ovulatory Phase":
        insights.append({
            "category": "Biological Phase",
            "title": "Luteinizing Hormone (LH) Surge",
            "summary": "Your body reaches its peak reproductive window and energetic crest of the month.",
            "impact_level": "positive",
            "confidence": 0.90,
            "scientific_context": "The LH surge triggers ovulation within 24-36 hours. Testosterone reaches its monthly crest alongside peak energy."
        })
    else:
        insights.append({
            "category": "Biological Phase",
            "title": "Progesterone Dominance & Luteal Calibration",
            "summary": "The corpus luteum secretes progesterone to nourish the endometrial lining, which slightly elevates body temperature and metabolic demand.",
            "impact_level": "neutral",
            "confidence": 0.93,
            "scientific_context": "Progesterone stimulates GABA receptors, inducing a desire for calmer environments. If pregnancy does not occur, hormone withdrawal may induce mild PMS."
        })

    # 3. Sleep / Energy observation
    if patterns.get("sleep_energy_correlation") is not None:
        corr = patterns["sleep_energy_correlation"]
        if corr > 0.3:
            insights.append({
                "category": "Sleep & Vitality",
                "title": "Sleep-Driven Vitality Identified",
                "summary": patterns["sleep_energy_insight"],
                "impact_level": "positive",
                "confidence": 0.88,
                "scientific_context": "Slow-wave and REM sleep modulate growth hormone release and insulin regulation, heavily influencing next-day perceived stamina."
            })

    # 4. Recurring symptom alert
    top_syms = patterns.get("top_recurring_symptoms", [])
    if top_syms:
        lead_sym = top_syms[0]
        insights.append({
            "category": "Symptom Patterns",
            "title": f"Primary Pattern: {lead_sym['symptom']}",
            "summary": f"{lead_sym['symptom']} was reported in {lead_sym['percentage']}% of your daily logs, primarily concentrated around cycle transitions.",
            "impact_level": "attention",
            "confidence": 0.85,
            "scientific_context": "Tracking recurring physical sensations helps you proactively prepare with heat, hydration, and nutritional magnesium before discomfort peaks."
        })

    return {
        "current_phase": current_phase,
        "current_cycle_day": pred.get("current_cycle_day", 1),
        "total_insights": len(insights),
        "insights": insights
    }

@router.get("/patterns")
def get_ai_patterns(db: Session = Depends(get_db)):
    cycles = db.query(Cycle).all()
    logs = db.query(HealthLog).all()
    return detect_patterns(logs, cycles)

@router.get("/changes")
def get_ai_changes(db: Session = Depends(get_db)):
    cycles = db.query(Cycle).all()
    logs = db.query(HealthLog).all()
    return detect_changes(logs, cycles, recent_days=7)

@router.get("/recommendations")
def get_ai_recommendations(db: Session = Depends(get_db)):
    cycles = db.query(Cycle).all()
    logs = db.query(HealthLog).order_by(HealthLog.log_date.desc()).limit(14).all()
    preg = db.query(PregnancyProfile).filter(PregnancyProfile.is_active == True).first()

    pred = predict_cycle(cycles)
    current_phase = pred.get("current_phase", "Follicular Phase")

    avg_sleep = 7.5
    energy_level = 6
    symptoms = []
    if logs:
        sleep_vals = [l.sleep_hours for l in logs if l.sleep_hours is not None]
        avg_sleep = float(np.mean(sleep_vals)) if sleep_vals else 7.5
        energy_level = logs[0].energy_level or 6

    is_pregnant = preg is not None and preg.is_active
    preg_week = 14 if is_pregnant else None

    recs = generate_recommendations(
        current_phase=current_phase,
        recent_symptoms=symptoms,
        avg_sleep=avg_sleep,
        energy_level=energy_level,
        is_pregnant=is_pregnant,
        pregnancy_week=preg_week
    )
    return recs
