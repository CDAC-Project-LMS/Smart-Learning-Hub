package com.smartlearninghub.repository;

import com.smartlearninghub.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
            SELECT r
            FROM Review r
            JOIN FETCH r.student
            WHERE r.course.id = :courseId
            """)
    Page<Review> findByCourseId(@Param("courseId") Long courseId, Pageable pageable);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}