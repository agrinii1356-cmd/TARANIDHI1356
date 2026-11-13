#!/usr/bin/env python3
"""Quick smoke test for PanchangPro API"""
import sys
sys.path.insert(0, "backend")
from datetime import datetime, timedelta
from app.services.panchang_engine import get_panchang, get_birth_chart, calculate_tara_bala
from app.services.scoring_engine import search_muhurats, ACTIVITY_RULES

print("=== PanchangPro Smoke Test ===\n")

# 1. Daily panchang
dt = datetime.now()
p = get_panchang(dt)
print(f"1. Daily Panchang ({dt.date()})")
print(f"   Tithi     : {p['tithi']['name']} ({p['tithi']['paksha']})")
print(f"   Nakshatra : {p['nakshatra']['name']} Pada {p['nakshatra']['pada']}")
print(f"   Vara      : {p['vara']['name']}")
print(f"   Yoga      : {p['yoga']['name']}")
print(f"   Karana    : {p['karana']['name']}")
print(f"   Engine    : {p['engine']}\n")

# 2. Birth chart
dob = datetime(1990, 5, 15, 10, 30)
chart = get_birth_chart(dob, 28.61, 77.20)
print(f"2. Birth Chart (1990-05-15)")
print(f"   Janma Nakshatra : {chart['janma_nakshatra']['name']}")
print(f"   Moon Rashi      : {chart['janma_rashi']['name']}\n")

# 3. Tara Bala
tara = calculate_tara_bala(chart['janma_nakshatra']['index'], p['nakshatra']['index'])
print(f"3. Tara Bala today")
print(f"   {tara['tara_name']} (#{tara['tara_number']}) — {'Shubh' if tara['is_shubh'] else 'Ashubh'}\n")

# 4. Activities
print(f"4. Activities loaded: {len(ACTIVITY_RULES)}")
for k in list(ACTIVITY_RULES.keys())[:5]:
    print(f"   - {k}")

# 5. Search
print("\n5. Muhurat Search (job_interview, next 10 days)")
results = search_muhurats(
    "job_interview",
    datetime.now(),
    datetime.now() + timedelta(days=10),
    chart['janma_nakshatra']['index'],
    chart['janma_rashi']['index'],
    max_results=3
)
for r in results:
    print(f"   {r['datetime'][:16]}  score={r['final_score']}  {r['quality']}")

print("\n=== All tests passed ===")
