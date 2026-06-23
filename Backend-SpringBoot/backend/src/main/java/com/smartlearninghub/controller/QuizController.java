package com.smartlearninghub.controller;

import com.smartlearninghub.dto.quiz.QuestionRequest;
import com.smartlearninghub.dto.quiz.QuestionResponse;
import com.smartlearninghub.dto.quiz.QuizAttemptRequest;
import com.smartlearninghub.dto.quiz.QuizAttemptResponse;
import com.smartlearninghub.dto.quiz.QuizRequest;
import com.smartlearninghub.dto.quiz.QuizResponse;
import com.smartlearninghub.service.QuizService;
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
@Tag(name = "Quizzes", description = "Quiz creation, question management, and automatic evaluation")
public class QuizController {

    private final QuizService quizService;

    // ========================= Instructor =========================

    @PostMapping("/api/instructor/courses/{courseId}/quizzes")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a quiz")
    public ResponseEntity<QuizResponse> createQuiz(
            @PathVariable Long courseId,
            @Valid @RequestBody QuizRequest request,
            Authentication authentication) {

        QuizResponse response =
                quizService.createQuiz(authentication.getName(), courseId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/api/instructor/quizzes/{quizId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete quiz")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {

        quizService.deleteQuiz(authentication.getName(), quizId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/instructor/quizzes/{quizId}/questions")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Add question")
    public ResponseEntity<QuestionResponse> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody QuestionRequest request,
            Authentication authentication) {

        QuestionResponse response =
                quizService.addQuestion(authentication.getName(), quizId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/instructor/questions/{questionId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Update question")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.updateQuestion(authentication.getName(), questionId, request)
        );
    }

    @DeleteMapping("/api/instructor/questions/{questionId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete question")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long questionId,
            Authentication authentication) {

        quizService.deleteQuestion(authentication.getName(), questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/instructor/courses/{courseId}/quizzes")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Operation(summary = "Get quizzes for instructor")
    public ResponseEntity<List<QuizResponse>> getQuizzesForInstructor(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                quizService.getQuizzesForCourse(courseId, true)
        );
    }

    // ========================= Student =========================

    @GetMapping("/api/courses/{courseId}/quizzes")
    @Operation(summary = "Get quizzes of course")
    public ResponseEntity<List<QuizResponse>> getQuizzesForCourse(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                quizService.getQuizzesForCourse(courseId, false)
        );
    }

    // ************ NEW API ************
    @GetMapping("/api/lessons/{lessonId}/quizzes")
    @Operation(summary = "Get quiz of a lesson")
    public ResponseEntity<List<QuizResponse>> getQuizzesForLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                quizService.getQuizzesForLesson(lessonId)
        );
    }

    @GetMapping("/api/quizzes/{quizId}/attempt")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get quiz for attempt")
    public ResponseEntity<QuizResponse> getQuizForAttempt(
            @PathVariable Long quizId) {

        return ResponseEntity.ok(
                quizService.getQuizForAttempt(quizId)
        );
    }

    @PostMapping("/api/quizzes/{quizId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit quiz")
    public ResponseEntity<QuizAttemptResponse> submitAttempt(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizAttemptRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.submitAttempt(authentication.getName(), quizId, request)
        );
    }

    @GetMapping("/api/student/quizzes/{quizId}/attempts")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "My attempts")
    public ResponseEntity<List<QuizAttemptResponse>> getMyAttempts(
            @PathVariable Long quizId,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.getMyAttempts(authentication.getName(), quizId)
        );
    }
}