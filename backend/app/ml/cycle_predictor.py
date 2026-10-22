from datetime import date, timedelta
from typing import List, Dict, Any, Optional
import numpy as np

def predict_cycle(cycles: list, reference_date: Optional[date] = None) -> Dict[str, Any]:
    today = reference_date or date.today()
    disclaimer = (
        "Predictions and fertile windows are algorithmic estimates based on historical logs. "
        "Variations naturally occur from stress, sleep, travel, or hormonal shifts. "
        "This tool is for personal wellness planning and must not be used for medical diagnosis or contraception."
    )

    if not cycles:
        # Default baseline when no historical cycles are recorded
        default_start = today
        est_len = 28
        est_period = 5
        next_start = default_start + timedelta(days=est_len)
        ovulation = next_start - timedelta(days=14)
        return {
            "next_period_start": next_start,
            "next_period_end": next_start + timedelta(days=est_period),
            "ovulation_date": ovulation,
            "fertile_window_start": ovulation - timedelta(days=5),
            "fertile_window_end": ovulation + timedelta(days=1),
            "estimated_cycle_length": est_len,
            "current_cycle_day": 1,
            "current_phase": "Follicular Phase",
            "confidence_score": 0.35,
            "confidence_level": "Low (Awaiting Historical Data)",
            "is_estimate": True,
            "disclaimer": disclaimer,
            "total_historical_cycles": 0
        }

    # Sort cycles chronologically by start date
    sorted_cycles = sorted(cycles, key=lambda c: c.start_date)
    last_cycle = sorted_cycles[-1]
    last_start = last_cycle.start_date
    
    lengths = [c.cycle_length for c in sorted_cycles if c.cycle_length and 18 <= c.cycle_length <= 60]
    durations = [c.period_duration for c in sorted_cycles if c.period_duration and 1 <= c.period_duration <= 14]

    if not lengths:
        lengths = [28]
    if not durations:
        durations = [5]

    # Statistical & ML Trend Analysis
    n = len(lengths)
    if n == 1:
        est_len = int(round(lengths[0]))
        std_dev = 3.0
        confidence = 0.50
    elif n == 2:
        weights = [0.4, 0.6]
        est_len = int(round(np.average(lengths, weights=weights)))
        std_dev = float(np.std(lengths))
        confidence = 0.65
    else:
        # Weighted recent average combined with linear trend prediction
        recent_weights = np.linspace(0.5, 1.5, n)
        recent_weights /= recent_weights.sum()
        weighted_avg = np.average(lengths, weights=recent_weights)
        
        # Scikit-learn style linear trend
        x = np.arange(n)
        y = np.array(lengths)
        slope, intercept = np.polyfit(x, y, 1) if n >= 3 else (0.0, weighted_avg)
        trend_pred = intercept + slope * n
        
        # Blend weighted average (70%) and trend prediction (30%)
        blended = 0.70 * weighted_avg + 0.30 * trend_pred
        est_len = int(round(np.clip(blended, 21, 45)))
        std_dev = float(np.std(lengths))
        
        # Confidence score derived from sample size & standard deviation
        consistency_factor = max(0.0, 1.0 - (std_dev / 7.0))
        sample_size_factor = min(1.0, n / 4.0)
        confidence = float(np.clip(0.40 + 0.40 * consistency_factor + 0.15 * sample_size_factor, 0.40, 0.95))

    est_period = int(round(np.mean(durations)))
    
    # Calculate next dates
    next_start = last_start + timedelta(days=est_len)
    
    # If the calculated next_start has already passed, adjust projection forward
    while next_start <= today:
        next_start += timedelta(days=est_len)
        
    next_end = next_start + timedelta(days=est_period)
    
    # Ovulation typically occurs 14 days before the start of the next cycle
    ovulation = next_start - timedelta(days=14)
    fertile_start = ovulation - timedelta(days=5)
    fertile_end = ovulation + timedelta(days=1)

    # Current cycle day calculation
    days_since_start = (today - last_start).days
    current_cycle_day = max(1, days_since_start + 1)
    
    # Determine phase
    if current_cycle_day <= est_period:
        current_phase = "Menstrual Phase"
    elif today < fertile_start:
        current_phase = "Follicular Phase"
    elif fertile_start <= today <= fertile_end:
        current_phase = "Ovulatory Phase"
    else:
        current_phase = "Luteal Phase"

    if confidence >= 0.80:
        conf_label = "High Confidence"
    elif confidence >= 0.60:
        conf_label = "Moderate Confidence"
    else:
        conf_label = "Fair (Building Baseline)"

    return {
        "next_period_start": next_start,
        "next_period_end": next_end,
        "ovulation_date": ovulation,
        "fertile_window_start": fertile_start,
        "fertile_window_end": fertile_end,
        "estimated_cycle_length": est_len,
        "current_cycle_day": current_cycle_day,
        "current_phase": current_phase,
        "confidence_score": round(confidence, 2),
        "confidence_level": conf_label,
        "is_estimate": True,
        "disclaimer": disclaimer,
        "total_historical_cycles": n
    }
