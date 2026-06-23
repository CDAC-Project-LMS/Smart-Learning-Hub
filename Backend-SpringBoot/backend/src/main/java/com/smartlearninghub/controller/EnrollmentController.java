package com.smartlearninghub.controller;


import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.enrollment.EnrollmentResponse;
import com.smartlearninghub.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/enrollments")
    public ResponseEntity<PageResponse<EnrollmentResponse>> getMyEnrollments(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                enrollmentService.getMyEnrollments(
                        authentication.getName(),
                        page,
                        size
                )
        );
    }

    @GetMapping("/courses/{courseId}/enrollment")
    public ResponseEntity<EnrollmentResponse> getEnrollmentDetails(
            @PathVariable Long courseId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                enrollmentService.getEnrollmentDetails(
                        authentication.getName(),
                        courseId
                )
        );
    }
    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<EnrollmentResponse> enrollCourse(
            @PathVariable Long courseId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                enrollmentService.enroll(
                        authentication.getName(),
                        courseId
                )
        );
    }
}