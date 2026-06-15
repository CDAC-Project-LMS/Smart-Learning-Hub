package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.dto.lesson.LessonRequest;
import com.smartlearninghub.dto.lesson.LessonResponse;
import com.smartlearninghub.entity.*;
import com.smartlearninghub.exception.BadRequestException;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.exception.UnauthorizedException;
import com.smartlearninghub.repository.*;
import com.smartlearninghub.service.LessonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public LessonResponse addLesson(String instructorEmail, Long courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        verifyOwnership(course, instructorEmail);

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .lessonOrder(request.getLessonOrder())
                .build();

        Lesson saved = lessonRepository.save(lesson);
        log.info("Lesson '{}' added to course {}", saved.getTitle(), courseId);
        return toResponse(saved, null);
    }

    @Override
    @Transactional
    public LessonResponse updateLesson(String instructorEmail, Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
        verifyOwnership(lesson.getCourse(), instructorEmail);

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setLessonOrder(request.getLessonOrder());

        Lesson saved = lessonRepository.save(lesson);
        return toResponse(saved, null);
    }

    @Override
    @Transactional
    public void deleteLesson(String instructorEmail, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
        verifyOwnership(lesson.getCourse(), instructorEmail);
        lessonRepository.delete(lesson);
    }

    @Override
    public List<LessonResponse> getLessonsForCourse(Long courseId, String studentEmail) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId);

        Long studentId = null;
        if (studentEmail != null) {
            studentId = userRepository.findByEmail(studentEmail).map(User::getId).orElse(null);
        }

        final Long finalStudentId = studentId;
        return lessons.stream().map(lesson -> {
            Boolean completed = null;
            if (finalStudentId != null) {
                completed = lessonProgressRepository.findByStudentIdAndLessonId(finalStudentId, lesson.getId())
                        .map(LessonProgress::getIsCompleted)
                        .orElse(false);
            }
            return toResponse(lesson, completed);
        }).toList();
    }

    @Override
    @Transactional
    public LessonResponse markLessonComplete(String studentEmail, Long lessonId) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", studentEmail));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), lesson.getCourse().getId());
        if (!enrolled) {
            throw new BadRequestException("You must be enrolled in this course to track lesson progress");
        }

        Optional<LessonProgress> existing = lessonProgressRepository.findByStudentIdAndLessonId(student.getId(), lessonId);
        LessonProgress progress = existing.orElseGet(() -> LessonProgress.builder()
                .student(student)
                .lesson(lesson)
                .build());
        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        lessonProgressRepository.save(progress);

        recalculateCourseProgress(student.getId(), lesson.getCourse().getId());

        return toResponse(lesson, true);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private void recalculateCourseProgress(Long studentId, Long courseId) {
        List<Lesson> allLessons = lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId);
        if (allLessons.isEmpty()) {
            return;
        }
        long completedCount = allLessons.stream()
                .filter(l -> lessonProgressRepository.findByStudentIdAndLessonId(studentId, l.getId())
                        .map(LessonProgress::getIsCompleted).orElse(false))
                .count();

        int percentage = (int) Math.round((completedCount * 100.0) / allLessons.size());

        enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).ifPresent(enrollment -> {
            enrollment.setProgressPercentage(percentage);
            if (percentage >= 100) {
                enrollment.setStatus(EnrollmentStatus.COMPLETED);
            }
            enrollmentRepository.save(enrollment);
        });
    }

    private void verifyOwnership(Course course, String instructorEmail) {
        if (!course.getInstructor().getEmail().equalsIgnoreCase(instructorEmail)) {
            throw new UnauthorizedException("You are not authorized to modify lessons for this course");
        }
    }

    private LessonResponse toResponse(Lesson lesson, Boolean completed) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .videoUrl(lesson.getVideoUrl())
                .lessonOrder(lesson.getLessonOrder())
                .isCompleted(completed)
                .build();
    }
}
