package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.dto.quiz.*;
import com.smartlearninghub.entity.*;
import com.smartlearninghub.exception.BadRequestException;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.exception.UnauthorizedException;
import com.smartlearninghub.repository.*;
import com.smartlearninghub.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final LessonRepository lessonRepository;

    @Override
    @Transactional
    public QuizResponse createQuiz(String instructorEmail, Long courseId, QuizRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        Lesson lesson = lessonRepository.findById(request.getLessonId())
        .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", request.getLessonId()));
        verifyOwnership(course, instructorEmail);

        Quiz quiz = Quiz.builder()
                .course(course)
                .lesson(lesson)
                .title(request.getTitle())
                .passPercentage(request.getPassPercentage())
                .build();

        Quiz saved = quizRepository.save(quiz);
        log.info("Quiz '{}' created for course {}", saved.getTitle(), courseId);
        return toQuizResponse(saved, true);
    }

    @Override
    @Transactional
    public QuestionResponse addQuestion(String instructorEmail, Long quizId, QuestionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        verifyOwnership(quiz.getCourse(), instructorEmail);

        Question question = Question.builder()
                .quiz(quiz)
                .question(request.getQuestion())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctOption(request.getCorrectOption())
                .build();

        Question saved = questionRepository.save(question);
        return toQuestionResponse(saved, true);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(String instructorEmail, Long questionId, QuestionRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));
        verifyOwnership(question.getQuiz().getCourse(), instructorEmail);

        question.setQuestion(request.getQuestion());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectOption(request.getCorrectOption());

        Question saved = questionRepository.save(question);
        return toQuestionResponse(saved, true);
    }

    @Override
    @Transactional
    public void deleteQuestion(String instructorEmail, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));
        verifyOwnership(question.getQuiz().getCourse(), instructorEmail);
        questionRepository.delete(question);
    }

    @Override
    @Transactional
    public void deleteQuiz(String instructorEmail, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        verifyOwnership(quiz.getCourse(), instructorEmail);
        quizRepository.delete(quiz);
    }

    @Override
    public List<QuizResponse> getQuizzesForCourse(Long courseId, boolean includeAnswers) {
        return quizRepository.findByCourseId(courseId).stream()
                .map(quiz -> toQuizResponse(quiz, includeAnswers))
                .toList();
    }
    @Override
    public List<QuizResponse> getQuizzesForLesson(Long lessonId) {

    return quizRepository.findByLessonId(lessonId)
            .stream()
            .map(quiz -> toQuizResponse(quiz, false))
            .toList();
}

    @Override
    public QuizResponse getQuizForAttempt(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        // correct answers are stripped out so students can't see them client-side
        return toQuizResponse(quiz, false);
    }

    @Override
    @Transactional
    public QuizAttemptResponse submitAttempt(String studentEmail, Long quizId, QuizAttemptRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", studentEmail));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        List<Question> questions = questionRepository.findByQuizId(quizId);
        if (questions.isEmpty()) {
            throw new BadRequestException("This quiz has no questions yet");
        }

        Map<Long, CorrectOption> submittedAnswers = request.getAnswers().stream()
                .collect(Collectors.toMap(AnswerRequest::getQuestionId, AnswerRequest::getSelectedOption,
                        (a, b) -> b));

        long correctCount = questions.stream()
                .filter(q -> q.getCorrectOption().equals(submittedAnswers.get(q.getId())))
                .count();

        int scorePercentage = (int) Math.round((correctCount * 100.0) / questions.size());
        boolean passed = scorePercentage >= quiz.getPassPercentage();

        QuizAttempt attempt = QuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .score(scorePercentage)
                .passed(passed)
                .build();

        QuizAttempt saved = quizAttemptRepository.save(attempt);
        log.info("Student {} attempted quiz {} - score: {}%, passed: {}", studentEmail, quizId, scorePercentage, passed);

        return QuizAttemptResponse.builder()
                .id(saved.getId())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .totalQuestions(questions.size())
                .correctAnswers((int) correctCount)
                .score(scorePercentage)
                .passed(passed)
                .attemptDate(saved.getAttemptDate())
                .build();
    }

    @Override
    public List<QuizAttemptResponse> getMyAttempts(String studentEmail, Long quizId) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", studentEmail));

        return quizAttemptRepository.findByStudentIdAndQuizId(student.getId(), quizId).stream()
                .map(attempt -> QuizAttemptResponse.builder()
                        .id(attempt.getId())
                        .quizId(attempt.getQuiz().getId())
                        .quizTitle(attempt.getQuiz().getTitle())
                        .totalQuestions(questionRepository.findByQuizId(quizId).size())
                        .score(attempt.getScore())
                        .passed(attempt.getPassed())
                        .attemptDate(attempt.getAttemptDate())
                        .build())
                .toList();
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private void verifyOwnership(Course course, String instructorEmail) {
        if (!course.getInstructor().getEmail().equalsIgnoreCase(instructorEmail)) {
            throw new UnauthorizedException("You are not authorized to manage quizzes for this course");
        }
    }
private QuizResponse toQuizResponse(Quiz quiz, boolean includeAnswers) {

    List<Question> questions = questionRepository.findByQuizId(quiz.getId());

    return QuizResponse.builder()
            .id(quiz.getId())
            .courseId(quiz.getCourse().getId())
            .lessonId(quiz.getLesson() != null ? quiz.getLesson().getId() : null)
            .title(quiz.getTitle())
            .passPercentage(quiz.getPassPercentage())
            .questions(
                    questions.stream()
                            .map(q -> toQuestionResponse(q, includeAnswers))
                            .toList()
            )
            .build();
}

    private QuestionResponse toQuestionResponse(Question question, boolean includeAnswer) {
        return QuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctOption(includeAnswer ? question.getCorrectOption() : null)
                .build();
    }
}
