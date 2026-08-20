import logging
from functools import lru_cache

from app.config import Settings, get_settings
from app.providers.base import AiProvider
from app.providers.gemini_provider import GeminiProvider
from app.providers.openai_provider import OpenAiProvider

logger = logging.getLogger("ai-service.factory")


@lru_cache
def get_active_provider() -> AiProvider:
    settings: Settings = get_settings()
    providers: dict[str, AiProvider] = {
        "gemini": GeminiProvider(settings),
        "openai": OpenAiProvider(settings),
    }

    provider = providers.get(settings.ai_provider.lower())
    if provider is None:
        logger.warning(
            "Configured AI provider '%s' not found, available providers: %s",
            settings.ai_provider,
            list(providers.keys()),
        )
        provider = next(iter(providers.values()))

    return provider
