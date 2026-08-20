package com.smartlearninghub.dto.quiz;

import com.smartlearninghub.entity.CorrectOption;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    /**
     * Only populated for instructor/admin views. Null when returned to a
     * student taking the quiz, so answers can't be inspected client-side.
     */
    private CorrectOption correctOption;
}
