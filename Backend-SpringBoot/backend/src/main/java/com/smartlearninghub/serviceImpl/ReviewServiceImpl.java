package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.review.ReviewRequest;
import com.smartlearninghub.dto.review.ReviewResponse;
import com.smartlearninghub.entity.Course;
import com.smartlearninghub.entity.Review;
import com.smartlearninghub.entity.User;
import com.smartlearninghub.exception.BadRequestException;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.repository.CourseRepository;
import com.smartlearninghub.repository.EnrollmentRepository;
import com.smartlearninghub.repository.ReviewRepository;
import com.smartlearninghub.repository.UserRepository;
import com.smartlearninghub.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public ReviewResponse addReview(String studentEmail, Long courseId, ReviewRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", studentEmail));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new BadRequestException("You must be enrolled in this course to leave a review");
        }

        if (reviewRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new BadRequestException("You have already reviewed this course");
        }

        Review review = Review.builder()
                .student(student)
                .course(course)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        log.info("Review added by {} for course {}", studentEmail, courseId);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getReviewsForCourse(Long courseId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Review> reviews = reviewRepository.findByCourseId(courseId, pageable);

        return PageResponse.from(
                reviews.map(this::toResponse)
        );
    }
    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .courseId(review.getCourse().getId())
                .studentId(review.getStudent().getId())
                .studentName(review.getStudent().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .build();
    }
}
