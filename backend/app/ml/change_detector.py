import json
from datetime import date, timedelta
from typing import List, Dict, Any
import numpy as np

def detect_changes(health_logs: list, cycles: list, recent_days: int = 7) -> Dict[str, Any]:
    if not health_logs:
        return {
            "analysis_period": "Awaiting data",
            "changes": [],
            "overall_summary": "Log health entries across multiple days to unlock personalized comparison insights.",
            "non_alarmist_advice": "Regular logging helps understand your natural biological rhythms over time."
        }

    sorted_logs = sorted(health_logs, key=lambda l: l.log_date)
    latest_date = sorted_logs[-1].log_date
    split_date = latest_date - timedelta(days=recent_days)

    recent_logs = [l for l in sorted_logs if l.log_date > split_date]
    baseline_logs = [l for l in sorted_logs if l.log_date <= split_date]

    if not baseline_logs:
        # If not enough days for baseline split, compare first half vs second half
        half = len(sorted_logs) // 2
        if half >= 1:
            baseline_logs = sorted_logs[:half]
            recent_logs = sorted_logs[half:]
        else:
            recent_logs = sorted_logs
            baseline_logs = sorted_logs

    def get_avg(logs, attr, default=0.0):
        vals = [getattr(l, attr) for l in logs if getattr(l, attr) is not None]
        return float(np.mean(vals)) if vals else default

    # 1. Sleep changes
    base_sleep = round(get_avg(baseline_logs, "sleep_hours", 7.5), 1)
    rec_sleep = round(get_avg(recent_logs, "sleep_hours", 7.5), 1)
    sleep_delta = round(rec_sleep - base_sleep, 1)
    sleep_sig = abs(sleep_delta) >= 0.75

    # 2. Energy changes
    base_energy = round(get_avg(baseline_logs, "energy_level", 6.0), 1)
    rec_energy = round(get_avg(recent_logs, "energy_level", 6.0), 1)
    energy_delta = round(rec_energy - base_energy, 1)
    energy_sig = abs(energy_delta) >= 1.0

    # 3. Pain changes
    base_pain = round(get_avg(baseline_logs, "pain_level", 1.0), 1)
    rec_pain = round(get_avg(recent_logs, "pain_level", 1.0), 1)
    pain_delta = round(rec_pain - base_pain, 1)
    pain_sig = abs(pain_delta) >= 1.0

    # 4. Cycle length change
    cycle_delta = 0
    cycle_sig = False
    base_cycle_len = 28.0
    rec_cycle_len = 28.0
    if len(cycles) >= 2:
        lengths = [c.cycle_length for c in sorted(cycles, key=lambda c: c.start_date) if c.cycle_length]
        if len(lengths) >= 2:
            base_cycle_len = round(float(np.mean(lengths[:-1])), 1)
            rec_cycle_len = float(lengths[-1])
            cycle_delta = round(rec_cycle_len - base_cycle_len, 1)
            cycle_sig = abs(cycle_delta) >= 2.0

    # 5. Symptom changes
    def extract_symptoms(logs):
        syms = set()
        for l in logs:
            if l.symptoms:
                try:
                    s_list = json.loads(l.symptoms) if isinstance(l.symptoms, str) else l.symptoms
                    for s in s_list:
                        syms.add(str(s).strip().lower())
                except Exception:
                    pass
        return syms

    base_syms = extract_symptoms(baseline_logs)
    rec_syms = extract_symptoms(recent_logs)
    new_symptoms = list(rec_syms - base_syms)

    changes = [
        {
            "metric": "Sleep Duration",
            "baseline_value": base_sleep,
            "recent_value": rec_sleep,
            "delta": sleep_delta,
            "direction": "increased" if sleep_delta > 0 else ("decreased" if sleep_delta < 0 else "stable"),
            "is_significant": sleep_sig,
            "summary_text": f"Recent sleep average is {rec_sleep}h ({'+' if sleep_delta > 0 else ''}{sleep_delta}h vs {base_sleep}h baseline)."
        },
        {
            "metric": "Energy Level",
            "baseline_value": base_energy,
            "recent_value": rec_energy,
            "delta": energy_delta,
            "direction": "increased" if energy_delta > 0 else ("decreased" if energy_delta < 0 else "stable"),
            "is_significant": energy_sig,
            "summary_text": f"Energy score shifted by {'+' if energy_delta > 0 else ''}{energy_delta} points to {rec_energy}/10."
        },
        {
            "metric": "Discomfort & Pain",
            "baseline_value": base_pain,
            "recent_value": rec_pain,
            "delta": pain_delta,
            "direction": "increased" if pain_delta > 0 else ("decreased" if pain_delta < 0 else "stable"),
            "is_significant": pain_sig,
            "summary_text": f"Reported discomfort averaged {rec_pain}/10 (baseline was {base_pain}/10)."
        }
    ]

    if len(cycles) >= 2:
        changes.append({
            "metric": "Cycle Length",
            "baseline_value": base_cycle_len,
            "recent_value": rec_cycle_len,
            "delta": cycle_delta,
            "direction": "lengthened" if cycle_delta > 0 else ("shortened" if cycle_delta < 0 else "stable"),
            "is_significant": cycle_sig,
            "summary_text": f"Latest cycle was {int(rec_cycle_len)} days ({'+' if cycle_delta > 0 else ''}{cycle_delta}d compared to previous average of {base_cycle_len}d)."
        })

    # AI narrative synthesis
    significant_items = [c for c in changes if c["is_significant"]]
    if not significant_items:
        overall = "Your daily wellness indicators show high consistency. Sleep, energy, and comfort levels remain closely aligned with your historical baseline."
        advice = "Keep maintaining your regular routine, nourishing meals, and restorative sleep habits."
    else:
        notable = ", ".join([c["metric"].lower() for c in significant_items])
        overall = f"We identified a notable shift in {notable} over the recent observation window compared to your prior baseline."
        advice = "Shifts in energy and sleep frequently mirror hormonal transitions across cycle phases or lifestyle demands. Prioritizing hydration, calming evening routines, and balanced nutrition will help support your body naturally."

    if new_symptoms:
        readable_syms = ", ".join([s.replace("_", " ").title() for s in new_symptoms[:3]])
        overall += f" Additionally, recently logged observations include: {readable_syms}."

    return {
        "analysis_period": f"Past {recent_days} Days vs. Historical Baseline",
        "changes": changes,
        "new_symptoms": [s.replace("_", " ").title() for s in new_symptoms],
        "overall_summary": overall,
        "non_alarmist_advice": advice
    }
