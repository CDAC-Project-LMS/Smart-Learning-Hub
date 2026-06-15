
package com.smartlearninghub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;


    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;


    private Integer progressPercentage;


    private LocalDateTime enrollmentDate;


    @PrePersist
    public void prePersist() {

        if(status == null){
            status = EnrollmentStatus.ACTIVE;
        }

        if(progressPercentage == null){
            progressPercentage = 0;
        }

        if(enrollmentDate == null){
            enrollmentDate = LocalDateTime.now();
        }
    }
}
