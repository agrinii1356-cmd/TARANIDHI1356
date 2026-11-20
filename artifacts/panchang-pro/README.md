# PanchangPro — Personalized DOB-based Panchang & Muhurat

**Vision**: जन्म कुंडली आधारित व्यक्तिगत मुहूर्त सिस्टम जो आधुनिक प्रोफेशनल और व्यक्तिगत जीवन के हर निर्णय को कॉस्मिक टाइमिंग से अलाइन करे।

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- API Docs: http://localhost:8000/docs
- Health:  http://localhost:8000/api/v1/health

Or use the script:
```bash
./scripts/run_backend.sh
```

### 2. Test Engine (no server needed)

```bash
cd panchang-pro
python3 scripts/test_api.py
```

### 3. Frontend (Website)

Simply open `frontend/index.html` in a browser.  
It will try to call the API at `localhost:8000`. If API is offline it shows demo results.

### 4. Flutter App (skeleton)

```bash
cd flutter_app
flutter pub get
flutter run
```

## Project Structure

```
panchang-pro/
├── backend/                 # FastAPI + calculation engine
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── core/config.py
│       ├── api/routes.py
│       └── services/
│           ├── panchang_engine.py   # Tithi, Nakshatra, Tara, Chandra, Hora...
│           └── scoring_engine.py    # 0-100 score + search
├── frontend/
│   └── index.html           # Full marketing + search UI (Tailwind)
├── flutter_app/             # Flutter skeleton (4 tabs)
├── activity_rules/
│   └── base_activities.json # 25+ modern activities
├── scripts/
│   ├── run_backend.sh
│   └── test_api.py
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/health | Health check |
| GET | /api/v1/panchang/daily | Full daily panchang + Rahu Kaal + Hora |
| POST | /api/v1/chart/birth | Birth chart (Janma Nakshatra + Rashi) |
| GET | /api/v1/activities | List all activity keys |
| POST | /api/v1/muhurat/search | Personalized muhurat search |
| GET | /api/v1/tara-bala | Tara Bala calculator |
| GET | /api/v1/personal-day | Quick personal day score |

## Scoring Formula

```
Final = Panchanga×40% + (Tara+Chandra)×25% + Lagna×20% + Dasha×15%
```

- ≥ 80 → Excellent
- 65–79 → Good
- 50–64 → Average
- < 50 → Avoid

## Production Notes

1. **Swiss Ephemeris**: Install `pyswisseph` and set `USE_SWISS_EPHEMERIS=True` in config. Replace `get_moon_longitude` / `get_sun_longitude` with `swe.calc_ut`.
2. **Database**: Add PostgreSQL + Redis for user profiles and cache.
3. **Auth**: Integrate Supabase / Firebase.
4. **Lagna & Dasha**: Full implementation requires house system + Vimshottari calculation (Swiss Ephemeris).

## License

Proprietary — for your startup use.
