# Smart Learning Hub - AI Service (Python)

Standalone Python microservice that powers the AI Learning Assistant chatbot
using an LLM (Gemini or OpenAI). It plays the same role in this architecture
as the .NET Certificate Service: the Spring Boot backend calls it over HTTP
for one specific job, this time "generate a chat reply."

```
Frontend (React) → Backend (Spring Boot, /api/ai/chat)
                        → AI Service (Python/FastAPI, /api/chat/generate)
                              → Gemini or OpenAI
```

The Spring Boot backend keeps ownership of building the prompt (system
instructions + course/lesson context pulled from the database), and this
service's only job is to forward that prompt to the configured LLM provider
and return the reply. That keeps business logic (DB access, auth) in Java and
keeps this service simple, stateless, and swappable.

## Endpoints

- `POST /api/chat/generate` — body `{ "prompt": "..." }`, returns `{ "reply": "...", "provider": "gemini" }`
- `GET /health` — returns `{ "status": "UP", "provider": "gemini" }`
- `GET /docs` — interactive Swagger UI (FastAPI auto-generated)

## Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate on Windows
pip install -r requirements.txt

cp .env.example .env
# then edit .env and set AI_PROVIDER + the matching API key
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

The service listens on `http://localhost:8000` by default.

## Run with Docker

```bash
docker build -t slh-ai-service .
docker run -p 8000:8000 --env-file .env slh-ai-service
```

## Configuration (`.env`)

| Variable | Description |
|---|---|
| `AI_PROVIDER` | `gemini` or `openai` |
| `GEMINI_API_KEY` | Required if `AI_PROVIDER=gemini` |
| `GEMINI_MODEL` | Default `gemini-3.5-flash` |
| `OPENAI_API_KEY` | Required if `AI_PROVIDER=openai` |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `ALLOWED_ORIGINS` | CORS origins allowed to call this service directly |
| `REQUEST_TIMEOUT_SECONDS` | Timeout for the outbound LLM call |

## Tests

```bash
pip install pytest
pytest
```

## Wiring it up to the Spring Boot backend

In `ZIP2-Backend-SpringBoot/backend/src/main/resources/application.properties`:

```properties
app.ai-service.base-url=http://localhost:8000
```

`AiServiceClient` (Java) calls `POST {base-url}/api/chat/generate` the same
way `CertificateServiceClient` calls the .NET service — see that file for
the exact pattern this mirrors.
