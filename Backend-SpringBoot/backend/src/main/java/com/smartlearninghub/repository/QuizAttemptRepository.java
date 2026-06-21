package com.smartlearninghub.repository;

import com.smartlearninghub.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);

    List<QuizAttempt> findByStudentId(Long studentId);

    boolean existsByStudentIdAndQuizIdAndPassedTrue(Long studentId, Long quizId);
}
