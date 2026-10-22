from datetime import date
from typing import List, Dict, Any, Optional

def generate_recommendations(
    current_phase: str,
    recent_symptoms: List[str],
    avg_sleep: float,
    energy_level: int,
    is_pregnant: bool = False,
    pregnancy_week: Optional[int] = None
) -> List[Dict[str, Any]]:
    recs = []

    if is_pregnant:
        trimester = 1 if (pregnancy_week or 0) <= 13 else (2 if (pregnancy_week or 0) <= 27 else 3)
        recs.append({
            "id": "preg_hydr",
            "category": "hydration",
            "title": "Maternal Hydration Support",
            "advice": "During pregnancy, blood volume expands significantly. Aim for 8-10 glasses (2.3 - 2.5L) of fresh water daily to support amniotic fluid and ease fatigue.",
            "phase_relevance": f"Trimester {trimester} (Week {pregnancy_week or 'Active'})",
            "action_item": "Keep a glass or insulated water bottle beside your workspace and bedside table.",
            "supportive_quote": "Your body is performing an incredible miracle of nurturing life each moment."
        })
        recs.append({
            "id": "preg_nutr",
            "category": "nutrition",
            "title": "Nourishing Gentle Nutrition",
            "advice": "Focus on folate-rich leafy greens, citrus, lean proteins, and easily digestible complex carbohydrates. Small, frequent meals can help prevent nausea.",
            "phase_relevance": f"Trimester {trimester}",
            "action_item": "Snack on whole-grain crackers, almonds, or ginger tea if feeling morning nausea.",
            "supportive_quote": "Listen to your body's cues and eat with grace and mindful presence."
        })
        recs.append({
            "id": "preg_rest",
            "category": "relaxation",
            "title": "Side-Sleeping & Restorative Rest",
            "advice": "Rest with pillows between your knees and under your abdomen to alleviate lower back pressure and foster deep restorative relaxation.",
            "phase_relevance": f"Trimester {trimester}",
            "action_item": "Practice 5 minutes of mindful belly breathing before sleep tonight.",
            "supportive_quote": "Rest is not an indulgence; it is essential nourishment for you and your little one."
        })
        return recs

    # Phase-targeted recommendations
    if current_phase == "Menstrual Phase":
        recs.append({
            "id": "phase_nutr",
            "category": "nutrition",
            "title": "Iron & Warm Nutrient Replenishment",
            "advice": "Hormone levels are at their lowest baseline. Replenish iron lost during menstruation with lentils, spinach, dark chocolate, and warm broths.",
            "phase_relevance": "Menstrual Phase",
            "action_item": "Sip on ginger or chamomile tea with a squeeze of lemon to aid iron absorption.",
            "supportive_quote": "Honor this time of rest and natural renewal. Slow down and give yourself permission to recharge."
        })
        recs.append({
            "id": "phase_move",
            "category": "relaxation",
            "title": "Gentle Restorative Movement",
            "advice": "High intensity cardio can elevate cortisol right now. Opt for gentle yin yoga, pelvic floor releases, and warm heating pads for cramping.",
            "phase_relevance": "Menstrual Phase",
            "action_item": "Try Child's Pose (Balasana) or Reclining Bound Angle for 10 soothing minutes.",
            "supportive_quote": "Your body's rhythm is sacred and wise."
        })
    elif current_phase == "Follicular Phase":
        recs.append({
            "id": "phase_nutr",
            "category": "nutrition",
            "title": "Energizing Fresh Proteins & Probiotics",
            "advice": "Estrogen is rising, which naturally enhances focus and metabolism. Enjoy fermented foods (kefir, kimchi), vibrant salads, and lean proteins.",
            "phase_relevance": "Follicular Phase",
            "action_item": "Incorporate pumpkin and flax seeds to support natural estrogen production.",
            "supportive_quote": "You are stepping into a phase of creative clarity, fresh ideas, and blooming vitality."
        })
        recs.append({
            "id": "phase_move",
            "category": "energy",
            "title": "Peak Building & Social Stamina",
            "advice": "Take advantage of higher stamina with cardio workouts, strength training, and tackling exciting creative projects.",
            "phase_relevance": "Follicular Phase",
            "action_item": "Schedule collaborative brainstorms or try a brisk morning outdoor jog.",
            "supportive_quote": "Trust your momentum as your natural energy expands."
        })
    elif current_phase == "Ovulatory Phase":
        recs.append({
            "id": "phase_nutr",
            "category": "nutrition",
            "title": "Antioxidant-Rich Liver Support",
            "advice": "Estrogen and testosterone hit their monthly peak. Cruciferous vegetables (broccoli, cabbage) and berries help the liver process excess hormones.",
            "phase_relevance": "Ovulatory Phase",
            "action_item": "Hydrate with chilled cucumber water and prepare a berry-kale smoothie bowl.",
            "supportive_quote": "You are at your natural monthly peak of magnetic confidence and expression."
        })
    else:  # Luteal Phase
        recs.append({
            "id": "phase_nutr",
            "category": "nutrition",
            "title": "Magnesium & Steady Blood Sugar",
            "advice": "Progesterone dominates, increasing metabolic needs by ~150-300 kcal/day. Eat complex carbohydrates (sweet potatoes, oats) to stabilize mood and cravings.",
            "phase_relevance": "Luteal Phase",
            "action_item": "Enjoy pumpkin seeds or dark chocolate (70%+) for natural magnesium to prevent cramps.",
            "supportive_quote": "Be kind to yourself as your body prepares for renewal. Your inner calm is your greatest strength."
        })
        recs.append({
            "id": "phase_relax",
            "category": "relaxation",
            "title": "Grounding & Nervous System Soothing",
            "advice": "Lower serotonin before menstruation can trigger mood shifts. Create space for quiet reflection, Epsom salt baths, and unhurried evenings.",
            "phase_relevance": "Luteal Phase",
            "action_item": "Unplug screens 45 minutes before sleep to protect melatonin synthesis.",
            "supportive_quote": "Every emotion you feel is valid. Allow yourself grace and quiet stillness."
        })

    # Hydration recommendation
    recs.append({
        "id": "daily_hydr",
        "category": "hydration",
        "title": "Electrolyte & Water Balance",
        "advice": "Sufficient hydration prevents headaches, eases bloating, and ensures smooth cellular detox across every cycle phase.",
        "phase_relevance": "Universal Daily Wellness",
        "action_item": "Aim for 8 full glasses today (approx 2 Liters), adding a pinch of Celtic sea salt or lemon.",
        "supportive_quote": "Water is life and clarity for every cell in your body."
    })

    # Sleep recommendation if sleep is low
    if avg_sleep < 7.0:
        recs.append({
            "id": "sleep_boost",
            "category": "sleep",
            "title": "Rest Recovery Protocol",
            "advice": f"Your recent sleep logged is averaging {round(avg_sleep, 1)} hours. Chronic sub-7h sleep triggers elevated cortisol, aggravating PMS and cycle irregularity.",
            "phase_relevance": "Rest Optimization",
            "action_item": "Target a 10:30 PM wind-down tonight with a soothing herbal tea.",
            "supportive_quote": "Sleep is the supreme repair medicine provided freely by nature."
        })

    return recs
