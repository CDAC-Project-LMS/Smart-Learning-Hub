package com.smartlearninghub.dto.quiz;

import com.smartlearninghub.entity.CorrectOption;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {

    @NotNull(message = "Question id is required")
    private Long questionId;

    @NotNull(message = "Selected option is required")
    private CorrectOption selectedOption;
}
