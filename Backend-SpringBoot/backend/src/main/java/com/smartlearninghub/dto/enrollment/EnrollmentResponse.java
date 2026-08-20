package com.smartlearninghub.dto.enrollment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseImage;
    private Long studentId;
    private String studentName;
    private String status;
    private Integer progressPercentage;
    private LocalDateTime enrollmentDate;
}
