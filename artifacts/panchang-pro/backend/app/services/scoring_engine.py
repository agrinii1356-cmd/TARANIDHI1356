"""
Muhurat Scoring Engine
======================
"""

from datetime import datetime, timedelta
from typing import Dict, List
import json
import os

from .panchang_engine import (
    calculate_tara_bala, calculate_chandra_bala, get_panchang
)

_RULES_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "activity_rules", "base_activities.json"
)

def _load_rules() -> Dict:
    try:
        with open(_RULES_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("activities", {})
    except Exception:
        return {}

ACTIVITY_RULES = _load_rules()

if not ACTIVITY_RULES:
    ACTIVITY_RULES = {
        "job_interview": {
            "name_en": "Job Interview",
            "name_hi": "नौकरी का इंटरव्यू",
            "category": "Career",
            "preferred_vara": ["Wednesday", "Thursday", "Friday"],
            "preferred_nakshatra": ["Hasta", "Pushya", "Rohini", "Uttara Phalguni"],
            "avoid_tithi": [4, 8, 9, 14, 30],
            "avoid_karana": ["Vishti"],
            "min_tara": 2,
            "karaka": ["Mercury", "Jupiter", "Sun"]
        }
    }

WEIGHTS = {
    "panchanga": 0.40,
    "tara_chandra": 0.25,
    "lagna": 0.20,
    "dasha": 0.15
}

def score_panchanga(panchang: Dict, rules: Dict) -> float:
    score = 50.0
    preferred_vara = rules.get("preferred_vara", [])
    vara_name = panchang["vara"]["name"]
    if vara_name in preferred_vara:
        score += 15
    elif vara_name in ["Tuesday", "Saturday"]:
        score -= 8

    tithi_num = panchang["tithi"]["number"]
    avoid_tithi = rules.get("avoid_tithi", [])
    if tithi_num in avoid_tithi:
        score -= 18
    elif panchang["tithi"].get("is_shubh"):
        score += 10

    if panchang["karana"]["is_vishti"]:
        score -= 25

    if panchang["yoga"].get("is_ashubh"):
        score -= 12
    elif panchang["yoga"].get("is_shubh"):
        score += 8

    preferred_nak = rules.get("preferred_nakshatra", [])
    if panchang["nakshatra"]["name"] in preferred_nak:
        score += 10

    return max(0.0, min(100.0, score))

def calculate_muhurat_score(
    dt: datetime,
    activity_key: str,
    janma_nak_index: int,
    janma_rashi_index: int,
    lat: float = 28.61,
    lon: float = 77.20,
    tz: float = 5.5,
    dasha_score: float = 55.0,
    lagna_score: float = 55.0
) -> Dict:
    rules = ACTIVITY_RULES.get(activity_key, list(ACTIVITY_RULES.values())[0])
    panchang = get_panchang(dt, lat, lon, tz)

    panch_score = score_panchanga(panchang, rules)

    tara = calculate_tara_bala(janma_nak_index, panchang["nakshatra"]["index"])
    chandra = calculate_chandra_bala(janma_rashi_index, panchang["moon_rashi"]["index"])
    personal_raw = tara["score"] + chandra["score"]
    personal_score = max(0.0, min(100.0, 50 + personal_raw))

    final = (
        panch_score * WEIGHTS["panchanga"] +
        personal_score * WEIGHTS["tara_chandra"] +
        lagna_score * WEIGHTS["lagna"] +
        dasha_score * WEIGHTS["dasha"]
    )

    if final >= 80:
        quality, color = "Excellent", "green"
    elif final >= 65:
        quality, color = "Good", "lightgreen"
    elif final >= 50:
        quality, color = "Average", "yellow"
    else:
        quality, color = "Avoid", "red"

    reasons = []
    if tara["is_shubh"]:
        reasons.append(f"Tara Bala favourable ({tara['tara_name']})")
    else:
        reasons.append(f"Tara Bala unfavourable ({tara['tara_name']})")
    if chandra["is_shubh"]:
        reasons.append("Chandra Bala strong")
    else:
        reasons.append("Chandra Bala weak (Moon in dusthana)")
    if panchang["karana"]["is_vishti"]:
        reasons.append("Vishti (Bhadra) Karana — avoid")
    if panchang["vara"]["name"] in rules.get("preferred_vara", []):
        reasons.append(f"Favourable weekday ({panchang['vara']['name']})")
    if panchang["yoga"].get("is_ashubh"):
        reasons.append(f"Ashubh Yoga ({panchang['yoga']['name']})")

    name = rules.get("name_en") or rules.get("name") or activity_key

    return {
        "datetime": dt.isoformat(),
        "activity": name,
        "activity_key": activity_key,
        "final_score": round(final, 1),
        "quality": quality,
        "color": color,
        "breakdown": {
            "panchanga": round(panch_score, 1),
            "personal_tara_chandra": round(personal_score, 1),
            "lagna": lagna_score,
            "dasha": dasha_score
        },
        "tara": tara,
        "chandra": chandra,
        "panchang_summary": {
            "tithi": f"{panchang['tithi']['name']} ({panchang['tithi']['paksha']})",
            "nakshatra": f"{panchang['nakshatra']['name']} Pada {panchang['nakshatra']['pada']}",
            "vara": panchang["vara"]["name"],
            "yoga": panchang["yoga"]["name"],
            "karana": panchang["karana"]["name"]
        },
        "reasons": reasons,
        "recommendation": (
            "Recommended" if final >= 65
            else "Consider alternatives" if final >= 50
            else "Avoid this time"
        )
    }

def search_muhurats(
    activity_key: str,
    start: datetime,
    end: datetime,
    janma_nak_index: int,
    janma_rashi_index: int,
    lat: float = 28.61,
    lon: float = 77.20,
    tz: float = 5.5,
    max_results: int = 10,
    min_score: float = 55.0
) -> List[Dict]:
    results = []
    current = start.replace(hour=0, minute=0, second=0, microsecond=0)
    sample_hours = [9, 11, 14, 16, 18]

    while current <= end and len(results) < max_results * 4:
        for h in sample_hours:
            dt = current.replace(hour=h, minute=0)
            if dt < datetime.now():
                continue
            score_data = calculate_muhurat_score(
                dt, activity_key, janma_nak_index, janma_rashi_index,
                lat, lon, tz
            )
            if score_data["final_score"] >= min_score:
                results.append(score_data)
        current += timedelta(days=1)

    results.sort(key=lambda x: x["final_score"], reverse=True)
    return results[:max_results]
