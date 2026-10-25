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

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "database_connected": db_manager.connected,
        "database_mode": "MongoDB" if not db_manager.use_fallback else "Local Resilient Store"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
