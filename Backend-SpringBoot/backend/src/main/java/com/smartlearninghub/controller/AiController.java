package com.smartlearninghub.controller;

import com.smartlearninghub.dto.ai.ChatRequest;
import com.smartlearninghub.dto.ai.ChatResponse;
import com.smartlearninghub.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AI Learning Assistant chatbot endpoint. Available to any authenticated
 * user (Student, Instructor, or Admin) via the floating chat widget.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "AI Learning Assistant chatbot")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Send a message to the AI Learning Assistant")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(aiService.chat(request));
    }
}
