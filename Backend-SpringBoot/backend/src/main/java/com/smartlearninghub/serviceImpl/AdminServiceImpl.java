package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.course.CourseResponse;
import com.smartlearninghub.dto.user.DashboardStatsResponse;
import com.smartlearninghub.dto.user.UserResponse;
import com.smartlearninghub.entity.Course;
import com.smartlearninghub.entity.Role;
import com.smartlearninghub.entity.User;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.mapper.CourseMapper;
import com.smartlearninghub.repository.*;
import com.smartlearninghub.service.AdminService;
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
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;
    private final PaymentRepository paymentRepository;
    private final CourseMapper courseMapper;

    @Override
    public PageResponse<UserResponse> getUsersByRole(Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findByRole(role, pageable);
        return PageResponse.from(users.map(this::toResponse));
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return PageResponse.from(users.map(this::toResponse));
    }

    @Override
    @Transactional
    public UserResponse setUserActiveStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsActive(active);
        User saved = userRepository.save(user);
        log.info("Admin set user {} active={}", userId, active);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        userRepository.delete(user);
        log.info("Admin deleted user {}", userId);
    }

    @Override
    public PageResponse<CourseResponse> getAllCoursesAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseRepository.findAll(pageable);
        return PageResponse.from(courses.map(courseMapper::toResponse));
    }

    @Override
    @Transactional
    public void deleteCourseAdmin(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        courseRepository.delete(course);
        log.info("Admin deleted course {}", courseId);
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalInstructors(userRepository.countByRole(Role.INSTRUCTOR))
                .totalCourses(courseRepository.count())
                .totalEnrollments(enrollmentRepository.count())
                .totalCertificatesIssued(certificateRepository.count())
                .totalRevenue(paymentRepository.sumSuccessfulPayments())
                .build();
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
