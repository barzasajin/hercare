import json
from datetime import date
from typing import List, Dict, Any
import numpy as np
import pandas as pd

def detect_patterns(health_logs: list, cycles: list) -> Dict[str, Any]:
    if not health_logs:
        return {
            "sleep_energy_correlation": None,
            "phase_mood_distribution": {},
            "phase_pain_averages": {},
            "top_recurring_symptoms": [],
            "cycle_variation_summary": "Log more daily entries to detect recurring health patterns.",
            "insights": []
        }

    # Extract log records into DataFrame
    records = []
    for log in health_logs:
        symptoms_list = []
        if log.symptoms:
            try:
                symptoms_list = json.loads(log.symptoms) if isinstance(log.symptoms, str) else log.symptoms
            except Exception:
                symptoms_list = [s.strip() for s in str(log.symptoms).split(",") if s.strip()]

        records.append({
            "date": log.log_date,
            "sleep_hours": float(log.sleep_hours) if log.sleep_hours is not None else 7.0,
            "energy_level": int(log.energy_level) if log.energy_level is not None else 5,
            "pain_level": int(log.pain_level) if log.pain_level is not None else 0,
            "mood": log.mood or "calm",
            "period_flow": log.period_flow or "none",
            "symptoms": symptoms_list
        })

    df = pd.DataFrame(records)

    # 1. Sleep vs. Energy correlation
    sleep_energy_corr = 0.0
    sleep_energy_insight = "Balanced sleep and energy records."
    if len(df) >= 3 and df["sleep_hours"].std() > 0 and df["energy_level"].std() > 0:
        corr = float(df["sleep_hours"].corr(df["energy_level"]))
        if not np.isnan(corr):
            sleep_energy_corr = round(corr, 2)
            if sleep_energy_corr > 0.4:
                sleep_energy_insight = f"Strong positive link: nights with >= 7.5 hrs sleep show {int(sleep_energy_corr*100)}% higher daytime vitality."
            elif sleep_energy_corr < -0.2:
                sleep_energy_insight = "Irregular sleep timing appears to reduce daytime alertness."
            else:
                sleep_energy_insight = "Moderate connection between rest duration and daytime energy."

    # 2. Cycle Phase Mapping
    def map_phase(log_d):
        if not cycles:
            return "Follicular"
        # Find nearest preceding cycle start date
        preceding = [c for c in cycles if c.start_date <= log_d]
        if not preceding:
            return "Follicular"
        active_c = max(preceding, key=lambda c: c.start_date)
        day_diff = (log_d - active_c.start_date).days + 1
        p_dur = active_c.period_duration or 5
        c_len = active_c.cycle_length or 28

        if day_diff <= p_dur:
            return "Menstrual"
        elif day_diff < (c_len - 14 - 3):
            return "Follicular"
        elif (c_len - 14 - 3) <= day_diff <= (c_len - 14 + 1):
            return "Ovulatory"
        elif day_diff <= c_len + 3:
            return "Luteal"
        else:
            return "Follicular"

    df["phase"] = df["date"].apply(map_phase)

    # Phase vs. Pain Level
    phase_pain = {}
    phase_pain_df = df.groupby("phase")["pain_level"].mean().to_dict()
    for phase_name in ["Menstrual", "Follicular", "Ovulatory", "Luteal"]:
        phase_pain[phase_name] = round(float(phase_pain_df.get(phase_name, 0.0)), 1)

    # Phase vs. Mood distribution
    phase_mood = {}
    for phase_name, group in df.groupby("phase"):
        mood_counts = group["mood"].value_counts().to_dict()
        phase_mood[phase_name] = {k: int(v) for k, v in mood_counts.items()}

    # Top recurring symptoms
    symptom_counter = {}
    for sym_list in df["symptoms"]:
        for s in sym_list:
            clean_s = str(s).strip().lower().replace("_", " ")
            symptom_counter[clean_s] = symptom_counter.get(clean_s, 0) + 1
    
    top_symptoms = [
        {"symptom": k.title(), "count": v, "percentage": int(round(v / max(1, len(df)) * 100))}
        for k, v in sorted(symptom_counter.items(), key=lambda x: x[1], reverse=True)[:6]
    ]

    # Cycle length variability
    cycle_summary = "Consistent cycle length observed."
    if len(cycles) >= 2:
        lengths = [c.cycle_length for c in cycles if c.cycle_length]
        variance = float(np.std(lengths)) if lengths else 0.0
        if variance <= 2.0:
            cycle_summary = f"Highly predictable cycles (length fluctuates by only ±{round(variance, 1)} days)."
        elif variance <= 4.5:
            cycle_summary = f"Standard natural variance observed (±{round(variance, 1)} days across recorded cycles)."
        else:
            cycle_summary = f"Noticeable cycle length variability (±{round(variance, 1)} days). Consider monitoring stress and sleep rhythm."

    return {
        "sleep_energy_correlation": sleep_energy_corr,
        "sleep_energy_insight": sleep_energy_insight,
        "phase_pain_averages": phase_pain,
        "phase_mood_distribution": phase_mood,
        "top_recurring_symptoms": top_symptoms,
        "cycle_variation_summary": cycle_summary
    }
