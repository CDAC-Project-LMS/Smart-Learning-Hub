package com.smartlearninghub.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String videoUrl;
    private Integer lessonOrder;
    private Boolean isCompleted;
}
