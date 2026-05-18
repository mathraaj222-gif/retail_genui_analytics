from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes.analytics import router as analytics_router

app = FastAPI(
    title="Retail Promotion Analytics API"
)

# CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    analytics_router,
    prefix="/analytics", # Simplified prefix to match frontend expectations
    tags=["Analytics"]
)