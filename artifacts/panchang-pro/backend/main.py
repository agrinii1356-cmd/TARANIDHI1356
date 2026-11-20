from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Personalized DOB-based Vedic Panchang & Muhurat Engine for modern lifestyle",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "message": "Welcome to PanchangPro API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/v1/health",
        "endpoints": [
            "GET  /api/v1/health",
            "GET  /api/v1/panchang/daily",
            "POST /api/v1/chart/birth",
            "GET  /api/v1/activities",
            "POST /api/v1/muhurat/search",
            "GET  /api/v1/tara-bala",
            "GET  /api/v1/personal-day"
        ]
    }
