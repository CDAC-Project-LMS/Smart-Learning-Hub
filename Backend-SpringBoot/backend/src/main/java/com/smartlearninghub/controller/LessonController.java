package com.smartlearninghub.controller;

import com.smartlearninghub.dto.lesson.LessonRequest;
import com.smartlearninghub.dto.lesson.LessonResponse;
import com.smartlearninghub.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Lessons", description = "Course lesson management and progress tracking")
public class LessonController {

    private final LessonService lessonService;

    @PostMapping("/api/instructor/courses/{courseId}/lessons")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Add a lesson to a course (Instructor only)")
    public ResponseEntity<LessonResponse> addLesson(@PathVariable Long courseId,
                                                      @Valid @RequestBody LessonRequest request,
                                                      Authentication authentication) {
        LessonResponse response = lessonService.addLesson(authentication.getName(), courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/instructor/lessons/{lessonId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Edit a lesson (Instructor only)")
    public ResponseEntity<LessonResponse> updateLesson(@PathVariable Long lessonId,
                                                         @Valid @RequestBody LessonRequest request,
                                                         Authentication authentication) {
        return ResponseEntity.ok(lessonService.updateLesson(authentication.getName(), lessonId, request));
    }

    @DeleteMapping("/api/instructor/lessons/{lessonId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a lesson (Instructor only)")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId, Authentication authentication) {
        lessonService.deleteLesson(authentication.getName(), lessonId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/courses/{courseId}/lessons")
    @Operation(summary = "Get all lessons for a course, with completion status if authenticated")
    public ResponseEntity<List<LessonResponse>> getLessons(@PathVariable Long courseId, Authentication authentication) {
        boolean isRealUser = authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName());
        String email = isRealUser ? authentication.getName() : null;
        return ResponseEntity.ok(lessonService.getLessonsForCourse(courseId, email));
    }

    @PostMapping("/api/student/lessons/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Mark a lesson as watched/completed (Student only)")
    public ResponseEntity<LessonResponse> markComplete(@PathVariable Long lessonId, Authentication authentication) {
        return ResponseEntity.ok(lessonService.markLessonComplete(authentication.getName(), lessonId));
    }
}
