import json
from datetime import date, timedelta
from sqlalchemy.orm import Session
from .models import User, Cycle, HealthLog, PregnancyProfile

def seed_database(db: Session):
    # Ensure default user exists
    user = db.query(User).first()
    if not user:
        user = User(name="Sarah Chen", email="sarah@hercare.ai")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check if cycles already exist
    existing_cycles = db.query(Cycle).filter(Cycle.user_id == user.id).count()
    if existing_cycles > 0:
        return {"status": "already_seeded", "message": "Database already contains user records."}

    today = date.today()
    
    # 4 Historical Cycles (spanning ~4 months backwards)
    # Cycle 1: 84 days ago (28 days)
    # Cycle 2: 56 days ago (29 days)
    # Cycle 3: 27 days ago (27 days)
    # Cycle 4: Current active cycle started 12 days ago
    
    c1_start = today - timedelta(days=96)
    c2_start = today - timedelta(days=68)
    c3_start = today - timedelta(days=39)
    c4_start = today - timedelta(days=12)

    cycles_data = [
        Cycle(user_id=user.id, start_date=c1_start, end_date=c1_start + timedelta(days=5), cycle_length=28, period_duration=5, flow_intensity="medium", notes="Regular cycle, mild day 1 cramping"),
        Cycle(user_id=user.id, start_date=c2_start, end_date=c2_start + timedelta(days=5), cycle_length=29, period_duration=5, flow_intensity="heavy", notes="Travelled during follicular phase"),
        Cycle(user_id=user.id, start_date=c3_start, end_date=c3_start + timedelta(days=4), cycle_length=27, period_duration=4, flow_intensity="medium", notes="Busy work deadline"),
        Cycle(user_id=user.id, start_date=c4_start, end_date=c4_start + timedelta(days=5), cycle_length=28, period_duration=5, flow_intensity="medium", notes="Current cycle, feeling energized at ovulation")
    ]
    db.add_all(cycles_data)

    # Generate daily health logs for the last 40 days
    moods_pool = ["calm", "happy", "energetic", "anxious", "sad", "irritable", "calm"]
    
    logs = []
    for i in range(40, -1, -1):
        log_d = today - timedelta(days=i)
        days_from_c4 = (log_d - c4_start).days + 1
        days_from_c3 = (log_d - c3_start).days + 1

        # Simulate natural cycle correlation
        # Period days
        if 1 <= days_from_c4 <= 5 or 1 <= days_from_c3 <= 4:
            period_flow = "heavy" if (days_from_c4 in [1, 2] or days_from_c3 in [1, 2]) else "medium"
            pain = 5 if period_flow == "heavy" else 2
            pain_types = ["cramps", "lower_back"] if pain > 3 else ["cramps"]
            mood = "irritable" if pain > 4 else "calm"
            energy = 4
            sleep = 6.5 if pain > 4 else 7.2
            symptoms = ["cramps", "fatigue", "tender_breasts"]
        elif 10 <= days_from_c4 <= 15:
            # Ovulation phase
            period_flow = "none"
            pain = 1
            pain_types = ["ovulation_twinge"] if log_d == today else []
            mood = "energetic"
            energy = 8
            sleep = 8.0
            symptoms = ["cravings"] if i % 2 == 0 else []
        elif days_from_c4 > 15 or (days_from_c3 > 18 and days_from_c4 < 1):
            # Luteal phase
            period_flow = "none"
            pain = 2
            pain_types = ["headache"] if i % 3 == 0 else []
            mood = "anxious" if i % 2 == 0 else "calm"
            energy = 5
            sleep = 7.0
            symptoms = ["bloating", "acne", "tender_breasts"]
        else:
            # Follicular phase
            period_flow = "none"
            pain = 0
            pain_types = []
            mood = "happy"
            energy = 7
            sleep = 7.8
            symptoms = []

        log_entry = HealthLog(
            user_id=user.id,
            log_date=log_d,
            period_flow=period_flow,
            pain_level=pain,
            pain_types=json.dumps(pain_types),
            mood=mood,
            energy_level=energy,
            sleep_hours=sleep,
            sleep_quality="good" if sleep >= 7.5 else "fair",
            symptoms=json.dumps(symptoms),
            notes="Feeling balanced today" if energy >= 7 else ("Resting with warm tea" if pain > 3 else "Routine day")
        )
        logs.append(log_entry)

    db.add_all(logs)

    # Pregnancy profile default
    preg = db.query(PregnancyProfile).filter(PregnancyProfile.user_id == user.id).first()
    if not preg:
        preg = PregnancyProfile(
            user_id=user.id,
            is_active=False,
            last_period_date=c4_start,
            due_date=c4_start + timedelta(days=280),
            notes="Pregnancy mode inactive"
        )
        db.add(preg)

    db.commit()
    return {"status": "success", "message": f"Seeded {len(cycles_data)} cycles and {len(logs)} daily health logs."}
