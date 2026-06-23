package com.smartlearninghub.controller;

import com.smartlearninghub.constants.AppConstants;
import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.course.CourseResponse;
import com.smartlearninghub.dto.user.DashboardStatsResponse;
import com.smartlearninghub.dto.user.UserResponse;
import com.smartlearninghub.entity.Role;
import com.smartlearninghub.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only endpoints: manage students, instructors, all users, all courses,
 * and view platform-wide dashboard/report statistics.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Platform administration: users, courses, and reports")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/students")
    @Operation(summary = "Get all students (paginated)")
    public ResponseEntity<PageResponse<UserResponse>> getStudents(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(adminService.getUsersByRole(Role.STUDENT, page, size));
    }

    @GetMapping("/instructors")
    @Operation(summary = "Get all instructors (paginated)")
    public ResponseEntity<PageResponse<UserResponse>> getInstructors(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(adminService.getUsersByRole(Role.INSTRUCTOR, page, size));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users regardless of role (paginated)")
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<UserResponse> setUserStatus(
            @PathVariable Long userId, @RequestParam boolean active) {
        return ResponseEntity.ok(adminService.setUserActiveStatus(userId, active));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete a user account")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses")
    @Operation(summary = "Get all courses on the platform (paginated)")
    public ResponseEntity<PageResponse<CourseResponse>> getAllCourses(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(adminService.getAllCoursesAdmin(page, size));
    }

    @DeleteMapping("/courses/{courseId}")
    @Operation(summary = "Delete any course on the platform")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId) {
        adminService.deleteCourseAdmin(courseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide dashboard statistics and reports")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
