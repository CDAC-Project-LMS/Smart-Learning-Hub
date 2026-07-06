package com.smartlearninghub.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @NotBlank(message = "Message is required")
    private String message;

    /**
     * Optional - when provided, the assistant grounds its answer in this
     * course's title/description/lessons so it can explain concepts,
     * summarize lessons, and recommend next steps contextually.
     */
    private Long courseId;
}
