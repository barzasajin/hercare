import sys
from app.database import SessionLocal, engine, Base
from app.models import User, Cycle, HealthLog, PregnancyProfile
from app.seed_data import seed_database
from app.ml.cycle_predictor import predict_cycle
from app.ml.pattern_engine import detect_patterns
from app.ml.change_detector import detect_changes
from app.ml.recommender import generate_recommendations

def test_all():
    print("--- 1. Testing Database Table Creation ---")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("--- 2. Testing Database Seeding ---")
    res = seed_database(db)
    print("Seed Result:", res)

    print("--- 3. Testing Queries ---")
    cycles = db.query(Cycle).all()
    logs = db.query(HealthLog).all()
    print(f"Found {len(cycles)} cycles and {len(logs)} health logs in database.")
    assert len(cycles) >= 4, "Expected at least 4 cycles"
    assert len(logs) >= 30, "Expected at least 30 logs"

    print("--- 4. Testing Cycle Prediction ML ---")
    pred = predict_cycle(cycles)
    print("Prediction:", {
        "next_period_start": str(pred["next_period_start"]),
        "estimated_cycle_length": pred["estimated_cycle_length"],
        "current_phase": pred["current_phase"],
        "confidence_score": pred["confidence_score"],
        "confidence_level": pred["confidence_level"]
    })
    assert "next_period_start" in pred

    print("--- 5. Testing Pattern Detection Engine ---")
    patterns = detect_patterns(logs, cycles)
    print("Sleep/Energy Corr:", patterns.get("sleep_energy_correlation"))
    print("Phase Pain Averages:", patterns.get("phase_pain_averages"))
    print("Top Symptoms:", patterns.get("top_recurring_symptoms")[:3])

    print("--- 6. Testing Change Detection Engine ---")
    changes = detect_changes(logs, cycles)
    print("Overall Change Summary:", changes.get("overall_summary"))
    print("Changes Detected Count:", len(changes.get("changes", [])))

    print("--- 7. Testing Personalized Recommender ---")
    recs = generate_recommendations(pred["current_phase"], [], 7.5, 7)
    print(f"Generated {len(recs)} personalized recommendations:")
    for r in recs[:2]:
        print(" -", r["title"], ":", r["action_item"])

    db.close()
    print("SUCCESS: All backend & ML tests completed successfully!")

if __name__ == "__main__":
    test_all()
