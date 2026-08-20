package com.smartlearninghub.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private Long lessonId;
    private Long id;
    private Long courseId;
    private String title;
    private Integer passPercentage;
    private List<QuestionResponse> questions;
}
