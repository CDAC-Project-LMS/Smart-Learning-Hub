"""
Smart Learning Hub - AI Service (Python / FastAPI)
====================================================
Standalone microservice that talks to an LLM provider (Gemini or OpenAI)
on behalf of the Spring Boot backend, the same way the .NET
CertificateService handles certificate generation.

Run locally:
    uvicorn app.main:app --reload --port 8000

The Spring Boot backend calls POST /api/chat/generate with a fully-formed
prompt and gets back { "reply": "...", "provider": "gemini" }.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.providers.factory import get_active_provider
from app.routers import chat
from app.schemas import HealthResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(name)s - %(message)s")

settings = get_settings()

app = FastAPI(
    title="Smart Learning Hub - AI Service",
    description="Python microservice that powers the AI Learning Assistant chatbot using an LLM.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health() -> HealthResponse:
    provider = get_active_provider()
    return HealthResponse(status="UP", provider=provider.name)
