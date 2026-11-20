"""Simple settings — no heavy deps required for core engine."""

class Settings:
    APP_NAME: str = "PanchangPro"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    USE_SWISS_EPHEMERIS: bool = False
    DEFAULT_LAT: float = 28.6139
    DEFAULT_LON: float = 77.2090
    DEFAULT_TZ: float = 5.5
    DEFAULT_AYANAMSA: str = "lahiri"

settings = Settings()
