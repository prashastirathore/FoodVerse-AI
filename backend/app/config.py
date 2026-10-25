import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FoodVerse AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # AI configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # MongoDB configuration
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "foodverse_db")
    
    # Security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "foodverse-forest-mint-cream-super-secret-key-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Environment
    DEMO_MODE_DEFAULT: bool = True

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
