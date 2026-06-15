package com.smartlearninghub.service;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.course.CourseRequest;
import com.smartlearninghub.dto.course.CourseResponse;

public interface CourseService {

    CourseResponse createCourse(String instructorEmail, CourseRequest request);

    CourseResponse updateCourse(String instructorEmail, Long courseId, CourseRequest request);

    void deleteCourse(String instructorEmail, Long courseId);

    CourseResponse getCourseById(Long courseId);

    PageResponse<CourseResponse> getAllCourses(int page, int size, String sortBy, String direction);

    PageResponse<CourseResponse> searchCourses(String keyword, int page, int size);

    PageResponse<CourseResponse> getCoursesByCategory(String category, int page, int size);

    PageResponse<CourseResponse> getCoursesByInstructor(String instructorEmail, int page, int size);

    CourseResponse uploadCourseImage(String instructorEmail, Long courseId, String imageUrl);
}
