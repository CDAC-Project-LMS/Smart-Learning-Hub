package com.smartlearninghub.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Internal request sent from the backend to the Python AI microservice's
 * `/api/chat/generate` endpoint. The backend builds the full prompt
 * (system preamble + course context + question) before calling out, so the
 * Python service stays a thin, stateless wrapper around the LLM provider.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerateRequest {

    private String prompt;
}
