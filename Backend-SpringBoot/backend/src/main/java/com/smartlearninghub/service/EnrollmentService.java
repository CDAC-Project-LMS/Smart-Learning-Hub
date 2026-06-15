package com.smartlearninghub.service;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.enrollment.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {


    EnrollmentResponse enroll(
            String studentEmail,
            Long courseId
    );


    PageResponse<EnrollmentResponse> getMyEnrollments(
            String studentEmail,
            int page,
            int size
    );


    EnrollmentResponse getEnrollmentDetails(
            String studentEmail,
            Long courseId
    );


    List<EnrollmentResponse> getEnrollmentsForCourse(
            String instructorEmail,
            Long courseId
    );
}
