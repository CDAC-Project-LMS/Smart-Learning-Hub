package com.smartlearninghub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic wrapper used for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private boolean success;
    private String message;

    // Extra data (reset link, token, etc.)
    private Object data;

    public static ApiResponse of(boolean success, String message) {
        return ApiResponse.builder()
                .success(success)
                .message(message)
                .build();
    }

    public static ApiResponse of(boolean success, String message, Object data) {
        return ApiResponse.builder()
                .success(success)
                .message(message)
                .data(data)
                .build();
    }
}