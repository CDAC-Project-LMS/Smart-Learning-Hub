package com.smartlearninghub.mapper;

import com.smartlearninghub.dto.course.CourseResponse;
import com.smartlearninghub.entity.Course;
import com.smartlearninghub.repository.EnrollmentRepository;
import com.smartlearninghub.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourseMapper {

    private final ReviewRepository reviewRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseResponse toResponse(Course course) {
        var reviews = reviewRepository.findByCourseId(course.getId(),
                org.springframework.data.domain.Pageable.unpaged()).getContent();

        double avgRating = reviews.isEmpty() ? 0.0 :
                reviews.stream().mapToInt(r -> r.getRating()).average().orElse(0.0);

        long enrollmentCount = enrollmentRepository.findByCourseId(course.getId()).size();

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .price(course.getPrice())
                .image(course.getImage())
                .category(course.getCategory())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getName())
                .isPublished(course.getIsPublished())
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalReviews((long) reviews.size())
                .totalEnrollments(enrollmentCount)
                .createdAt(course.getCreatedAt())
                .build();
    }
}
