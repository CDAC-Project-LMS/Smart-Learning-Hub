from abc import ABC, abstractmethod


class AiProvider(ABC):
    """
    Abstraction over an AI text-generation provider (Gemini, OpenAI, or any
    future provider). Equivalent to the `AiProvider` Java interface that
    used to live in the Spring Boot backend.
    """

    name: str

    @abstractmethod
    async def generate_response(self, prompt: str) -> str:
        """Send a fully-formed prompt to the underlying model and return its text reply."""
        raise NotImplementedError
