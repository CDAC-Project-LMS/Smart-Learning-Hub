package com.smartlearninghub.repository;

import com.smartlearninghub.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {


	 @EntityGraph(attributePaths = "instructor")
	    Page<Course> findAll(Pageable pageable);

	    @EntityGraph(attributePaths = "instructor")
	    Optional<Course> findById(Long id);

	    @EntityGraph(attributePaths = "instructor")
	    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);

	    @EntityGraph(attributePaths = "instructor")
	    Page<Course> findByCategoryIgnoreCase(String category, Pageable pageable);

	    @EntityGraph(attributePaths = "instructor")
	    Page<Course> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

	    @EntityGraph(attributePaths = "instructor")
	    Page<Course> findByIsPublishedTrue(Pageable pageable);
}