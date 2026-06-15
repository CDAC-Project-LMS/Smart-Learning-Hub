package com.smartlearninghub.service;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.review.ReviewRequest;
import com.smartlearninghub.dto.review.ReviewResponse;

public interface ReviewService {

    ReviewResponse addReview(String studentEmail, Long courseId, ReviewRequest request);

    PageResponse<ReviewResponse> getReviewsForCourse(Long courseId, int page, int size);
}
