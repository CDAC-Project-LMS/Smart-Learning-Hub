package com.smartlearninghub.service;

import com.smartlearninghub.dto.quiz.QuestionRequest;
import com.smartlearninghub.dto.quiz.QuestionResponse;
import com.smartlearninghub.dto.quiz.QuizAttemptRequest;
import com.smartlearninghub.dto.quiz.QuizAttemptResponse;
import com.smartlearninghub.dto.quiz.QuizRequest;
import com.smartlearninghub.dto.quiz.QuizResponse;

import java.util.List;

public interface QuizService {

    // Instructor
    QuizResponse createQuiz(String instructorEmail, Long courseId, QuizRequest request);

    QuestionResponse addQuestion(String instructorEmail, Long quizId, QuestionRequest request);

    QuestionResponse updateQuestion(String instructorEmail, Long questionId, QuestionRequest request);

    void deleteQuestion(String instructorEmail, Long questionId);

    void deleteQuiz(String instructorEmail, Long quizId);

    // Course quizzes
    List<QuizResponse> getQuizzesForCourse(Long courseId, boolean includeAnswers);

    // NEW: Get quizzes of a particular lesson
    List<QuizResponse> getQuizzesForLesson(Long lessonId);

    // Student
    QuizResponse getQuizForAttempt(Long quizId);

    QuizAttemptResponse submitAttempt(String studentEmail,
                                      Long quizId,
                                      QuizAttemptRequest request);

    List<QuizAttemptResponse> getMyAttempts(String studentEmail, Long quizId);
}