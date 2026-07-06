package com.smartlearninghub.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response returned by the Python AI microservice's
 * `/api/chat/generate` endpoint.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerateResponse {

    private String reply;
    private String provider;
}
