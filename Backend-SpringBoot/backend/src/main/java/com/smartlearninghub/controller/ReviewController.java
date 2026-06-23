package com.smartlearninghub.controller;

import com.smartlearninghub.constants.AppConstants;
import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.review.ReviewRequest;
import com.smartlearninghub.dto.review.ReviewResponse;
import com.smartlearninghub.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Course reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/api/student/courses/{courseId}/reviews")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Add a review for a course the student is enrolled in")
    public ResponseEntity<ReviewResponse> addReview(@PathVariable Long courseId,
                                                      @Valid @RequestBody ReviewRequest request,
                                                      Authentication authentication) {
        ReviewResponse response = reviewService.addReview(authentication.getName(), courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/courses/{courseId}/reviews")
    @Operation(summary = "Get all reviews for a course (public)")
    public ResponseEntity<PageResponse<ReviewResponse>> getReviews(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(reviewService.getReviewsForCourse(courseId, page, size));
    }
}
