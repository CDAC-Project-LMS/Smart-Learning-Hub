package com.smartlearninghub.repository;

import com.smartlearninghub.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("""
        SELECT c
        FROM Certificate c
        JOIN FETCH c.course
        JOIN FETCH c.student
        WHERE c.student.id = :studentId
    """)
    List<Certificate> findAllByStudentId(@Param("studentId") Long studentId);
}