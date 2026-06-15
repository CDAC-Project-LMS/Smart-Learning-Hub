package com.smartlearninghub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    @Column(name = "certificate_number", nullable = false, unique = true, length = 100)
    private String certificateNumber;

    @Column(name = "issue_date", updatable = false)
    private LocalDateTime issueDate;

    @Column(name = "pdf_path", length = 500)
    private String pdfPath;

    @PrePersist
    protected void onCreate() {
        this.issueDate = LocalDateTime.now();
    }
}
