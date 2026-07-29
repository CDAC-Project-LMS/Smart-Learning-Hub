-- ============================================================
-- Smart Learning Hub - Certificate Service Database
-- MySQL 8 (matches Pomelo.EntityFrameworkCore.MySql provider)
-- This mirrors what `dotnet ef database update` will create;
-- provided as a reference/fallback if EF tooling isn't available.
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_learning_hub_certificates
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smart_learning_hub_certificates;

CREATE TABLE IF NOT EXISTS certificate_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    course_id BIGINT NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    instructor_name VARCHAR(150),
    certificate_number VARCHAR(100) NOT NULL,
    pdf_file_name VARCHAR(255),
    pdf_path VARCHAR(500),
    issue_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_certificate_number UNIQUE (certificate_number),
    CONSTRAINT uq_student_course_cert UNIQUE (student_id, course_id)
) ENGINE=InnoDB;
