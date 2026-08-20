package com.smartlearninghub.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String image;
    private String category;
    private Long instructorId;
    private String instructorName;
    private Boolean isPublished;
    private Double averageRating;
    private Long totalReviews;
    private Long totalEnrollments;
    private LocalDateTime createdAt;
}
