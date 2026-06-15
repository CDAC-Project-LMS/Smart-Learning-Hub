package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.course.CourseRequest;
import com.smartlearninghub.dto.course.CourseResponse;
import com.smartlearninghub.entity.Course;
import com.smartlearninghub.entity.User;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.exception.UnauthorizedException;
import com.smartlearninghub.mapper.CourseMapper;
import com.smartlearninghub.repository.CourseRepository;
import com.smartlearninghub.repository.UserRepository;
import com.smartlearninghub.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    @Override
    @Transactional
    public CourseResponse createCourse(String instructorEmail, CourseRequest request) {
        User instructor = getInstructor(instructorEmail);

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .image(request.getImage())
                .category(request.getCategory())
                .instructor(instructor)
                .isPublished(true)
                .build();

        Course saved = courseRepository.save(course);
        log.info("Course '{}' created by instructor {}", saved.getTitle(), instructorEmail);
        return courseMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(String instructorEmail, Long courseId, CourseRequest request) {
        Course course = getCourseAndVerifyOwnership(instructorEmail, courseId);

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        if (request.getImage() != null) {
            course.setImage(request.getImage());
        }
        course.setCategory(request.getCategory());

        Course saved = courseRepository.save(course);
        log.info("Course {} updated by instructor {}", courseId, instructorEmail);
        return courseMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCourse(String instructorEmail, Long courseId) {
        Course course = getCourseAndVerifyOwnership(instructorEmail, courseId);
        courseRepository.delete(course);
        log.info("Course {} deleted by instructor {}", courseId, instructorEmail);
    }

   

    @Override
    public PageResponse<CourseResponse> getAllCourses(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Course> coursePage = courseRepository.findByIsPublishedTrue(pageable);
        return PageResponse.from(coursePage.map(courseMapper::toResponse));
    }
   @Override
@Transactional(readOnly = true)
public CourseResponse getCourseById(Long courseId) {

    Course course = courseRepository.findById(courseId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Course", "id", courseId));

    return courseMapper.toResponse(course);
}

    @Override
    public PageResponse<CourseResponse> searchCourses(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> coursePage = courseRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        return PageResponse.from(coursePage.map(courseMapper::toResponse));
    }

    @Override
    public PageResponse<CourseResponse> getCoursesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> coursePage = courseRepository.findByCategoryIgnoreCase(category, pageable);
        return PageResponse.from(coursePage.map(courseMapper::toResponse));
    }

    @Override
    public PageResponse<CourseResponse> getCoursesByInstructor(String instructorEmail, int page, int size) {
        User instructor = getInstructor(instructorEmail);
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> coursePage = courseRepository.findByInstructorId(instructor.getId(), pageable);
        return PageResponse.from(coursePage.map(courseMapper::toResponse));
    }

    @Override
    @Transactional
    public CourseResponse uploadCourseImage(String instructorEmail, Long courseId, String imageUrl) {
        Course course = getCourseAndVerifyOwnership(instructorEmail, courseId);
        course.setImage(imageUrl);
        Course saved = courseRepository.save(course);
        return courseMapper.toResponse(saved);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private User getInstructor(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Course getCourseAndVerifyOwnership(String instructorEmail, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getInstructor().getEmail().equalsIgnoreCase(instructorEmail)) {
            throw new UnauthorizedException("You are not authorized to modify this course");
        }
        return course;
    }
}
