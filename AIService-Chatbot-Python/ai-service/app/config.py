"""
Smart Learning Hub - AI Service Configuration
==============================================
Centralised settings loaded from environment variables (or a local .env
file). Mirrors the `app.ai.*` keys that used to live in the Spring Boot
backend's application.properties.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Which provider to use: "gemini" or "openai"
    ai_provider: str = "gemini"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    # CORS - allow the Spring Boot backend (and, for local debugging, the
    # frontend) to call this service directly if ever needed.
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
    ]

    request_timeout_seconds: float = 30.0

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
