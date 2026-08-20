package com.smartlearninghub.dto.quiz;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private Long lessonId;

    @NotNull(message = "Pass percentage is required")
    @Min(value = 0, message = "Pass percentage must be at least 0")
    @Max(value = 100, message = "Pass percentage must not exceed 100")
    private Integer passPercentage;
}
