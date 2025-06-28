from pydantic_settings import BaseSettings
from typing import Optional
from pydantic_settings import SettingsConfigDict

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "mongodb://localhost:27017"
    MONGO_INITDB_DATABASE: str = "glow_guard"
    
    # JWT
    JWT_SECRET_KEY: str = "change_this_secret_key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CLIENT_ORIGIN: str = "http://localhost:5173"
    
    # Pydantic v2 settings config
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra='ignore')

settings = Settings()