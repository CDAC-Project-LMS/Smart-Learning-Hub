package com.smartlearninghub.client;

import com.smartlearninghub.dto.ai.AiGenerateRequest;
import com.smartlearninghub.dto.ai.AiGenerateResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * HTTP client for the Python AI microservice (FastAPI + LLM). Same shape as
 * {@link CertificateServiceClient}: the backend builds the request, calls
 * the external microservice, and gracefully degrades if it's unreachable.
 */
@Component
@Slf4j
public class AiServiceClient {

    private final WebClient webClient;

    public AiServiceClient(
            WebClient.Builder webClientBuilder,
            @Value("${app.ai-service.base-url}") String baseUrl) {

        log.info("AI Service URL : {}", baseUrl);

        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .build();
    }

    public AiGenerateResponse generate(String prompt) {

        log.info("Calling Python AI Service");

        try {
            AiGenerateResponse response = webClient.post()
                    .uri("/api/chat/generate")
                    .bodyValue(new AiGenerateRequest(prompt))
                    .retrieve()
                    .bodyToMono(AiGenerateResponse.class)
                    .block();

            if (response == null) {
                throw new IllegalStateException("Empty response from AI service");
            }

            return response;

        } catch (WebClientResponseException e) {

            log.error(
                    "AI Service HTTP Error. Status={}, Body={}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

            return new AiGenerateResponse(
                    "Sorry, the AI assistant is temporarily unavailable. Please try again shortly.",
                    "unavailable"
            );

        } catch (Exception e) {

            log.error("AI Service Connection Failed", e);

            return new AiGenerateResponse(
                    "Sorry, the AI assistant is temporarily unavailable. Please try again shortly.",
                    "unavailable"
            );
        }
    }
}
