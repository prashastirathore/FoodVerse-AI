from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.config import settings
from app.database import db_manager
from app.routers import (
    auth_router,
    nutrition_router,
    freshness_router,
    hygiene_router,
    assistant_router,
    meal_router,
    dashboard_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    print(">>> Starting FoodVerse AI Backend...")
    await db_manager.connect()
    yield
    # Shutdown: Close DB
    print(">>> Shutting down FoodVerse AI Backend...")
    await db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Food Intelligence Agent API powered by Google Gemini AI and MongoDB",
    lifespan=lifespan
)

# Configure allowed CORS origins
raw_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
dev_origins = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]
allowed_origins = list(dict.fromkeys(raw_origins + dev_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router.router, prefix=settings.API_PREFIX)
app.include_router(nutrition_router.router, prefix=settings.API_PREFIX)
app.include_router(freshness_router.router, prefix=settings.API_PREFIX)
app.include_router(hygiene_router.router, prefix=settings.API_PREFIX)
app.include_router(assistant_router.router, prefix=settings.API_PREFIX)
app.include_router(meal_router.router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "status": "active",
        "description": "Multimodal Food Intelligence Agent with Gemini Vision AI, Freshness Detection, Restaurant Hygiene, Smart Cooking Assistant, and Meal Planner."
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb_connected": db_manager.is_mongodb_connected,
        "storage_mode": "MongoDB" if db_manager.is_mongodb_connected else "Local Resilient Store"
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
