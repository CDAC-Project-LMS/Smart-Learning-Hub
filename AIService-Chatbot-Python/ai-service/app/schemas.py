from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    """
    Sent by the Spring Boot backend. `prompt` is the fully-formed prompt
    (system preamble + optional course context + student question) - the
    backend keeps ownership of that logic since it already has DB access
    to courses/lessons. This service only needs to talk to the LLM.
    """

    prompt: str = Field(..., min_length=1, description="Fully-formed prompt to send to the LLM")


class GenerateResponse(BaseModel):
    reply: str
    provider: str


class HealthResponse(BaseModel):
    status: str
    provider: str
