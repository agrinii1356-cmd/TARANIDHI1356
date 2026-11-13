from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, Field

from ..services.panchang_engine import (
    get_panchang, get_birth_chart, calculate_tara_bala,
    get_approximate_sunrise_sunset, get_rahu_kaal, get_abhijit_muhurat, get_hora_table
)
from ..services.scoring_engine import (
    calculate_muhurat_score, search_muhurats, ACTIVITY_RULES
)

router = APIRouter(prefix="/api/v1", tags=["PanchangPro"])

# ---------- Schemas ----------

class BirthData(BaseModel):
    year: int = Field(..., example=1990)
    month: int = Field(..., example=5)
    day: int = Field(..., example=15)
    hour: int = 12
    minute: int = 0
    lat: float = 28.6139
    lon: float = 77.2090
    tz_offset: float = 5.5

class MuhuratRequest(BaseModel):
    activity: str = Field(..., example="job_interview")
    start_date: str = Field(..., example="2026-10-04")
    end_date: str = Field(..., example="2026-10-20")
    birth: BirthData
    max_results: int = 10
    min_score: float = 55.0

# ---------- Endpoints ----------

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "PanchangPro API",
        "version": "1.0.0",
        "engine": "demo_approximation"
    }

@router.get("/panchang/daily")
def daily_panchang(
    date: str = Query(..., example="2026-10-04"),
    lat: float = 28.6139,
    lon: float = 77.2090,
    tz: float = 5.5
):
    try:
        dt = datetime.fromisoformat(date)
    except ValueError:
        raise HTTPException(400, "Invalid date. Use YYYY-MM-DD")
    panchang = get_panchang(dt, lat, lon, tz)
    sunrise, sunset = get_approximate_sunrise_sunset(dt, lat, lon)
    rahu = get_rahu_kaal(dt, sunrise, sunset)
    abhijit = get_abhijit_muhurat(sunrise, sunset)
    horas = get_hora_table(dt, sunrise)
    return {
        **panchang,
        "sunrise": sunrise.isoformat(),
        "sunset": sunset.isoformat(),
        "rahu_kaal": rahu,
        "abhijit_muhurat": abhijit,
        "hora_table": horas[:12]  # day horas
    }

@router.post("/chart/birth")
def birth_chart(data: BirthData):
    dob = datetime(data.year, data.month, data.day, data.hour, data.minute)
    return get_birth_chart(dob, data.lat, data.lon, data.tz_offset)

@router.get("/activities")
def list_activities():
    items = []
    for k, v in ACTIVITY_RULES.items():
        items.append({
            "key": k,
            "name_en": v.get("name_en") or v.get("name"),
            "name_hi": v.get("name_hi"),
            "category": v.get("category", "General")
        })
    return {"count": len(items), "activities": items}

@router.post("/muhurat/search")
def search_muhurat(req: MuhuratRequest):
    if req.activity not in ACTIVITY_RULES:
        raise HTTPException(
            400,
            f"Unknown activity '{req.activity}'. Call /api/v1/activities for list."
        )
    try:
        start = datetime.fromisoformat(req.start_date)
        end = datetime.fromisoformat(req.end_date)
    except ValueError:
        raise HTTPException(400, "Invalid date format. Use YYYY-MM-DD")

    dob = datetime(
        req.birth.year, req.birth.month, req.birth.day,
        req.birth.hour, req.birth.minute
    )
    chart = get_birth_chart(dob, req.birth.lat, req.birth.lon, req.birth.tz_offset)
    janma_nak = chart["janma_nakshatra"]["index"]
    janma_rashi = chart["janma_rashi"]["index"]

    results = search_muhurats(
        req.activity, start, end, janma_nak, janma_rashi,
        req.birth.lat, req.birth.lon, req.birth.tz_offset,
        req.max_results, req.min_score
    )

    return {
        "activity": ACTIVITY_RULES[req.activity].get("name_en") or req.activity,
        "birth_nakshatra": chart["janma_nakshatra"]["name"],
        "birth_rashi": chart["janma_rashi"]["name"],
        "total_found": len(results),
        "results": results
    }

@router.get("/tara-bala")
def tara_bala_endpoint(
    janma_nak: int = Query(..., ge=0, le=26),
    current_nak: int = Query(..., ge=0, le=26)
):
    return calculate_tara_bala(janma_nak, current_nak)

@router.get("/personal-day")
def personal_day_score(
    date: str = Query(..., example="2026-10-04"),
    janma_nak: int = Query(..., ge=0, le=26),
    janma_rashi: int = Query(..., ge=0, le=11),
    lat: float = 28.6139,
    lon: float = 77.2090,
    tz: float = 5.5
):
    """Quick personal favourability of a whole day."""
    try:
        dt = datetime.fromisoformat(date).replace(hour=12)
    except ValueError:
        raise HTTPException(400, "Invalid date")
    score = calculate_muhurat_score(
        dt, "job_interview", janma_nak, janma_rashi, lat, lon, tz
    )
    return {
        "date": date,
        "personal_score": score["final_score"],
        "quality": score["quality"],
        "tara": score["tara"],
        "chandra": score["chandra"],
        "panchang": score["panchang_summary"]
    }
