package com.smartlearninghub.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResponse {

    private Long id;
    private Long quizId;
    private String quizTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer score;
    private Boolean passed;
    private LocalDateTime attemptDate;
}
