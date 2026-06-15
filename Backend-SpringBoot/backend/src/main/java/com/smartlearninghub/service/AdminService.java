package com.smartlearninghub.service;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.course.CourseResponse;
import com.smartlearninghub.dto.user.DashboardStatsResponse;
import com.smartlearninghub.dto.user.UserResponse;
import com.smartlearninghub.entity.Role;

public interface AdminService {

    PageResponse<UserResponse> getUsersByRole(Role role, int page, int size);

    PageResponse<UserResponse> getAllUsers(int page, int size);

    UserResponse setUserActiveStatus(Long userId, boolean active);

    void deleteUser(Long userId);

    PageResponse<CourseResponse> getAllCoursesAdmin(int page, int size);

    void deleteCourseAdmin(Long courseId);

    DashboardStatsResponse getDashboardStats();
}
