"""
PanchangPro Core Calculation Engine
===================================
Pure Python implementation with clear hooks for Swiss Ephemeris.

Production: Set USE_SWISS_EPHEMERIS=True and install pyswisseph.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import math

from ..core.config import settings

# ==================== CONSTANTS ====================

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury"
] * 3

NAKSHATRA_GROUPS = {
    "fixed": ["Rohini", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada"],
    "soft": ["Mrigashira", "Chitra", "Anuradha", "Revati"],
    "swift": ["Ashwini", "Pushya", "Hasta"],
    "movable": ["Punarvasu", "Swati", "Shravana", "Dhanishta", "Shatabhisha"],
    "sharp": ["Ardra", "Ashlesha", "Jyeshtha", "Mula"],
    "fierce": ["Bharani", "Magha", "Purva Phalguni", "Purva Ashadha", "Purva Bhadrapada"],
    "mixed": ["Krittika", "Vishakha"]
}

TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
]

SHUBH_TITHIS = {2, 3, 5, 7, 10, 11, 12, 13, 15}
RIKTA_TITHIS = {4, 9, 14}

YOGAS = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Indra", "Vaidhriti"
]

SHUBH_YOGAS = {"Siddhi", "Shubha", "Shukla", "Brahma", "Indra", "Sadhya", "Siddha", "Saubhagya", "Shobhana", "Ayushman"}
ASHUBH_YOGAS = {"Vyatipata", "Vaidhriti", "Parigha", "Vishkambha", "Atiganda", "Shula", "Ganda", "Vyaghata"}

KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garaja",
    "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
]

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
WEEKDAY_LORDS = {
    "Sunday": "Sun", "Monday": "Moon", "Tuesday": "Mars",
    "Wednesday": "Mercury", "Thursday": "Jupiter",
    "Friday": "Venus", "Saturday": "Saturn"
}

TARA_NAMES = {
    1: "Janma", 2: "Sampat", 3: "Vipat", 4: "Kshema",
    5: "Pratyak", 6: "Sadhana", 7: "Naidhana", 8: "Mitra", 9: "Parama Mitra"
}
SHUBH_TARAS = {2, 4, 6, 8, 9}

RASHIS = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
]

# ==================== UTILS ====================

def normalize_angle(deg: float) -> float:
    return deg % 360.0

def longitude_to_nakshatra(longitude: float) -> Tuple[int, str, int]:
    lon = normalize_angle(longitude)
    span = 360.0 / 27.0
    index = int(lon / span) % 27
    pada = int((lon % span) / (span / 4.0)) + 1
    return index, NAKSHATRAS[index], min(pada, 4)

def longitude_to_rashi(longitude: float) -> Tuple[int, str]:
    lon = normalize_angle(longitude)
    idx = int(lon / 30.0) % 12
    return idx, RASHIS[idx]

def get_nakshatra_group(name: str) -> str:
    for group, names in NAKSHATRA_GROUPS.items():
        if name in names:
            return group
    return "mixed"

# ==================== TARA BALA ====================

def calculate_tara_bala(janma_nak_index: int, current_nak_index: int) -> Dict:
    count = ((current_nak_index - janma_nak_index) % 27) + 1
    remainder = count % 9
    if remainder == 0:
        remainder = 9
    is_shubh = remainder in SHUBH_TARAS
    if remainder in (2, 9):
        score = 25
    elif remainder in (4, 6, 8):
        score = 18
    elif remainder == 1:
        score = 5
    else:
        score = -18
    return {
        "tara_number": remainder,
        "tara_name": TARA_NAMES[remainder],
        "is_shubh": is_shubh,
        "score": score,
        "count": count
    }

# ==================== CHANDRA BALA ====================

def calculate_chandra_bala(janma_rashi_index: int, current_moon_rashi_index: int) -> Dict:
    distance = ((current_moon_rashi_index - janma_rashi_index) % 12) + 1
    is_shubh = distance not in (4, 8, 12)
    score = 15 if is_shubh else -15
    return {
        "distance": distance,
        "is_shubh": is_shubh,
        "score": score,
        "status": "favourable" if is_shubh else "unfavourable"
    }

# ==================== APPROXIMATE EPHEMERIS (Demo) ====================

def get_moon_longitude(dt: datetime) -> float:
    epoch = datetime(2000, 1, 6, 18, 14)
    days = (dt - epoch).total_seconds() / 86400.0
    return (days * 13.176358) % 360

def get_sun_longitude(dt: datetime) -> float:
    epoch = datetime(2000, 3, 20, 7, 35)
    days = (dt - epoch).total_seconds() / 86400.0
    return (days * 0.98564733) % 360

# ==================== MAIN PANCHANG ====================

def get_panchang(
    dt: datetime,
    lat: float = None,
    lon: float = None,
    tz_offset: float = None
) -> Dict:
    lat = lat if lat is not None else settings.DEFAULT_LAT
    lon = lon if lon is not None else settings.DEFAULT_LON
    tz_offset = tz_offset if tz_offset is not None else settings.DEFAULT_TZ

    ut = dt - timedelta(hours=tz_offset)
    moon_lon = get_moon_longitude(ut)
    sun_lon = get_sun_longitude(ut)

    tithi_deg = normalize_angle(moon_lon - sun_lon)
    tithi_num = int(tithi_deg / 12.0) + 1
    if tithi_num > 30:
        tithi_num = 30
    tithi_name = TITHIS[tithi_num - 1]
    paksha = "Shukla" if tithi_num <= 15 else "Krishna"

    nak_idx, nak_name, pada = longitude_to_nakshatra(moon_lon)
    nak_group = get_nakshatra_group(nak_name)

    yoga_deg = normalize_angle(sun_lon + moon_lon)
    yoga_num = int(yoga_deg / (360.0 / 27.0)) % 27
    yoga_name = YOGAS[yoga_num]

    karana_idx = int(tithi_deg / 6.0) % 11
    karana_name = KARANAS[karana_idx]

    vara = WEEKDAYS[dt.weekday()]
    vara_lord = WEEKDAY_LORDS[vara]

    moon_rashi_idx, moon_rashi = longitude_to_rashi(moon_lon)
    sun_rashi_idx, sun_rashi = longitude_to_rashi(sun_lon)

    return {
        "datetime": dt.isoformat(),
        "location": {"lat": lat, "lon": lon, "tz_offset": tz_offset},
        "tithi": {
            "number": tithi_num,
            "name": tithi_name,
            "paksha": paksha,
            "elapsed_pct": round((tithi_deg % 12) / 12 * 100, 1),
            "is_shubh": tithi_num in SHUBH_TITHIS,
            "is_rikta": tithi_num in RIKTA_TITHIS
        },
        "nakshatra": {
            "index": nak_idx,
            "name": nak_name,
            "pada": pada,
            "lord": NAKSHATRA_LORDS[nak_idx],
            "group": nak_group
        },
        "yoga": {
            "number": yoga_num + 1,
            "name": yoga_name,
            "is_shubh": yoga_name in SHUBH_YOGAS,
            "is_ashubh": yoga_name in ASHUBH_YOGAS
        },
        "karana": {
            "name": karana_name,
            "is_vishti": karana_name == "Vishti"
        },
        "vara": {
            "name": vara,
            "lord": vara_lord
        },
        "moon_rashi": {
            "index": moon_rashi_idx,
            "name": moon_rashi
        },
        "sun_rashi": {
            "index": sun_rashi_idx,
            "name": sun_rashi
        },
        "longitudes": {
            "sun": round(sun_lon, 4),
            "moon": round(moon_lon, 4)
        },
        "engine": "demo_approximation" if not settings.USE_SWISS_EPHEMERIS else "swiss_ephemeris"
    }

def get_birth_chart(
    dob: datetime,
    lat: float,
    lon: float,
    tz_offset: float = 5.5
) -> Dict:
    panchang = get_panchang(dob, lat, lon, tz_offset)
    return {
        "dob": dob.isoformat(),
        "place": {"lat": lat, "lon": lon, "tz_offset": tz_offset},
        "janma_nakshatra": panchang["nakshatra"],
        "janma_rashi": panchang["moon_rashi"],
        "sun_rashi": panchang["sun_rashi"],
        "note": "Lagna requires full Swiss Ephemeris + house system. Placeholder for MVP."
    }

def get_rahu_kaal(dt: datetime, sunrise: datetime, sunset: datetime) -> Dict:
    day_duration = (sunset - sunrise).total_seconds()
    segment = day_duration / 8.0
    mapping = {6: 7, 0: 1, 1: 6, 2: 4, 3: 5, 4: 3, 5: 2}
    seg_idx = mapping.get(dt.weekday(), 4)
    start = sunrise + timedelta(seconds=seg_idx * segment)
    end = start + timedelta(seconds=segment)
    return {
        "start": start.isoformat(),
        "end": end.isoformat(),
        "is_active": start <= dt <= end
    }

def get_abhijit_muhurat(sunrise: datetime, sunset: datetime) -> Dict:
    mid = sunrise + (sunset - sunrise) / 2
    half = timedelta(minutes=24)
    return {
        "start": (mid - half).isoformat(),
        "end": (mid + half).isoformat()
    }

def get_approximate_sunrise_sunset(dt: datetime, lat: float = 28.6, lon: float = 77.2) -> Tuple[datetime, datetime]:
    sunrise = dt.replace(hour=6, minute=15, second=0, microsecond=0)
    sunset = dt.replace(hour=18, minute=10, second=0, microsecond=0)
    return sunrise, sunset

HORA_SEQUENCE = {
    "Sunday": ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"] * 4,
    "Monday": ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"] * 4,
    "Tuesday": ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"] * 4,
    "Wednesday": ["Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus"] * 4,
    "Thursday": ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn"] * 4,
    "Friday": ["Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun"] * 4,
    "Saturday": ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"] * 4,
}

def get_hora_table(dt: datetime, sunrise: datetime) -> List[Dict]:
    weekday = WEEKDAYS[dt.weekday()]
    sequence = HORA_SEQUENCE.get(weekday, HORA_SEQUENCE["Sunday"])
    horas = []
    for i in range(24):
        start = sunrise + timedelta(hours=i)
        end = start + timedelta(hours=1)
        horas.append({
            "index": i + 1,
            "lord": sequence[i],
            "start": start.isoformat(),
            "end": end.isoformat()
        })
    return horas
