package com.smartlearninghub.controller;

import com.smartlearninghub.constants.AppConstants;
import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.course.CourseRequest;
import com.smartlearninghub.dto.course.CourseResponse;
import com.smartlearninghub.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Course APIs.
 * - GET endpoints are public (students browse without logging in).
 * - Create/Update/Delete are restricted to the INSTRUCTOR who owns the course.
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Browse, search, and manage courses")
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/api/courses")
    @Operation(summary = "Get all published courses (paginated, sortable)")
    public ResponseEntity<PageResponse<CourseResponse>> getAllCourses(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String direction) {
        return ResponseEntity.ok(courseService.getAllCourses(page, size, sortBy, direction));
    }

    @GetMapping("/api/courses/{id}")
    @Operation(summary = "Get course details by id")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/api/courses/search")
    @Operation(summary = "Search courses by title keyword")
    public ResponseEntity<PageResponse<CourseResponse>> searchCourses(
            @RequestParam String keyword,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(courseService.searchCourses(keyword, page, size));
    }

    @GetMapping("/api/courses/category/{category}")
    @Operation(summary = "Get courses filtered by category")
    public ResponseEntity<PageResponse<CourseResponse>> getCoursesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(courseService.getCoursesByCategory(category, page, size));
    }

    @PostMapping("/api/instructor/courses")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a new course (Instructor only)")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request,
                                                         Authentication authentication) {
        CourseResponse response = courseService.createCourse(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/instructor/courses/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Update an existing course (Instructor only, must be owner)")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id,
                                                         @Valid @RequestBody CourseRequest request,
                                                         Authentication authentication) {
        return ResponseEntity.ok(courseService.updateCourse(authentication.getName(), id, request));
    }

    @DeleteMapping("/api/instructor/courses/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a course (Instructor only, must be owner)")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id, Authentication authentication) {
        courseService.deleteCourse(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/instructor/courses/{id}/image")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Update the course cover image URL (Instructor only)")
    public ResponseEntity<CourseResponse> uploadCourseImage(@PathVariable Long id,
                                                              @RequestParam String imageUrl,
                                                              Authentication authentication) {
        return ResponseEntity.ok(courseService.uploadCourseImage(authentication.getName(), id, imageUrl));
    }

    @GetMapping("/api/instructor/courses/mine")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Get all courses owned by the logged-in instructor")
    public ResponseEntity<PageResponse<CourseResponse>> getMyCourses(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            Authentication authentication) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(authentication.getName(), page, size));
    }
}
