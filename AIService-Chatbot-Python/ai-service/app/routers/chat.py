import logging

from fastapi import APIRouter

from app.providers.factory import get_active_provider
from app.schemas import GenerateRequest, GenerateResponse

logger = logging.getLogger("ai-service.chat")

router = APIRouter(prefix="/api/chat", tags=["AI Assistant"])


@router.post("/generate", response_model=GenerateResponse, summary="Generate a chat reply from the active LLM")
async def generate(request: GenerateRequest) -> GenerateResponse:
    provider = get_active_provider()
    reply = await provider.generate_response(request.prompt)
    return GenerateResponse(reply=reply, provider=provider.name)
