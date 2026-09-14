import logging

import httpx

from app.config import Settings
from app.providers.base import AiProvider

logger = logging.getLogger("ai-service.openai")


class OpenAiProvider(AiProvider):
    name = "openai"

    def __init__(self, settings: Settings):
        self._api_key = settings.openai_api_key
        self._model = settings.openai_model
        self._timeout = settings.request_timeout_seconds
        self._url = "https://api.openai.com/v1/chat/completions"

    async def generate_response(self, prompt: str) -> str:
        if not self._api_key:
            return "The AI assistant is not configured yet. Please set OPENAI_API_KEY on the server."

        payload = {
            "model": self._model,
            "messages": [{"role": "user", "content": prompt}],
        }

        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    self._url,
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "Content-Type": "application/json",
                    },
                )
                response.raise_for_status()
                data = response.json()

            choices = data.get("choices") or []
            if choices:
                return choices[0].get("message", {}).get(
                    "content", "Sorry, I couldn't generate a response right now."
                )
            return "Sorry, I couldn't generate a response right now."

        except httpx.HTTPStatusError as exc:
            logger.error("OpenAI HTTP error: %s - %s", exc.response.status_code, exc.response.text)
            return "Sorry, the AI assistant is temporarily unavailable. Please try again shortly."
        except Exception:
            logger.exception("OpenAI API call failed")
            return "Sorry, the AI assistant is temporarily unavailable. Please try again shortly."
