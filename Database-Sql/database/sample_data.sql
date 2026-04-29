-- ============================================================
-- Smart Learning Hub - Sample Data
-- NOTE: Passwords below are BCrypt hashes of "Password@123"
-- ============================================================

USE smart_learning_hub;

-- Users: 1 Admin, 2 Instructors, 3 Students
INSERT INTO users (name, email, password, phone, role) VALUES
('System Admin', 'admin@smartlearninghub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa1QVy0Bp1w2fF2vT9r5H5U0Xq1LhM9K', '9000000001', 'ADMIN'),
('Rahul Sharma', 'rahul.instructor@smartlearninghub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa1QVy0Bp1w2fF2vT9r5H5U0Xq1LhM9K', '9000000002', 'INSTRUCTOR'),
('Priya Verma', 'priya.instructor@smartlearninghub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa1QVy0Bp1w2fF2vT9r5H5U0Xq1LhM9K', '9000000003', 'INSTRUCTOR'),
('Amit Kumar', 'amit.student@smartlearninghub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa1QVy0Bp1w2fF2vT9r5H5U0Xq1LhM9K', '9000000004', 'STUDENT'),
('Sneha Iyer', 'sneha.student@smartlearninghub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa1QVy0Bp1w2fF2vT9r5H5U0Xq1LhM9K', '9000000005', 'STUDENT'),
('Vikram Singh', 'vikram.student@smartlearninghub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa1QVy0Bp1w2fF2vT9r5H5U0Xq1LhM9K', '9000000006', 'STUDENT');

-- Courses (instructor_id 2 = Rahul, 3 = Priya)
INSERT INTO courses (title, description, price, image, category, instructor_id) VALUES
('Java Full Stack Development', 'Learn Java, Spring Boot, and React from scratch to build production-ready applications.', 4999.00, 'java-fullstack.jpg', 'Programming', 2),
('Complete Python Bootcamp', 'Master Python programming with hands-on projects covering web, data science, and automation.', 3999.00, 'python-bootcamp.jpg', 'Programming', 2),
('React.js for Beginners', 'Build modern, responsive user interfaces using React Hooks and React Router.', 2999.00, 'react-beginners.jpg', 'Web Development', 3),
('SQL & Database Design', 'Understand relational database design, normalization, and advanced SQL queries.', 1999.00, 'sql-database.jpg', 'Database', 3);

-- Lessons for Course 1 (Java Full Stack)
INSERT INTO lessons (course_id, title, description, video_url, lesson_order) VALUES
(1, 'Introduction to Java', 'Overview of Java, JDK setup, and your first program.', 'https://example.com/videos/java-intro.mp4', 1),
(1, 'Spring Boot Basics', 'Setting up a Spring Boot project and understanding annotations.', 'https://example.com/videos/spring-boot-basics.mp4', 2),
(1, 'Building REST APIs', 'Creating controllers, services, and repositories.', 'https://example.com/videos/rest-apis.mp4', 3);

-- Lessons for Course 3 (React)
INSERT INTO lessons (course_id, title, description, video_url, lesson_order) VALUES
(3, 'React Fundamentals', 'Components, props, and JSX basics.', 'https://example.com/videos/react-fundamentals.mp4', 1),
(3, 'React Hooks', 'useState, useEffect, and custom hooks.', 'https://example.com/videos/react-hooks.mp4', 2);

-- Enrollments
INSERT INTO enrollments (student_id, course_id, status, progress_percentage) VALUES
(4, 1, 'ACTIVE', 60),
(4, 3, 'COMPLETED', 100),
(5, 1, 'ACTIVE', 30),
(6, 2, 'ACTIVE', 10);

-- Quizzes
INSERT INTO quizzes (course_id, title, pass_percentage) VALUES
(1, 'Java Basics Quiz', 60),
(3, 'React Fundamentals Quiz', 50);

-- Questions for Quiz 1
INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES
(1, 'Which keyword is used to inherit a class in Java?', 'implements', 'extends', 'inherits', 'super', 'B'),
(1, 'Which of these is not a Java primitive type?', 'int', 'boolean', 'String', 'char', 'C'),
(1, 'JVM stands for?', 'Java Virtual Machine', 'Java Verified Method', 'Java Variable Method', 'Java Visual Machine', 'A');

-- Questions for Quiz 2
INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES
(2, 'Which hook is used to manage state in a functional component?', 'useEffect', 'useState', 'useRef', 'useMemo', 'B'),
(2, 'What does JSX stand for?', 'JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension', 'A');

-- Quiz Attempts
INSERT INTO quiz_attempts (student_id, quiz_id, score, passed) VALUES
(4, 1, 66, TRUE),
(4, 2, 100, TRUE),
(5, 1, 33, FALSE);

-- Payments
INSERT INTO payments (student_id, course_id, amount, payment_status) VALUES
(4, 1, 4999.00, 'SUCCESS'),
(4, 3, 2999.00, 'SUCCESS'),
(5, 1, 4999.00, 'SUCCESS'),
(6, 2, 3999.00, 'SUCCESS');

-- Certificates (Amit completed React course)
INSERT INTO certificates (student_id, course_id, certificate_number, pdf_path) VALUES
(4, 3, 'CERT-2026-0001', '/certificates/CERT-2026-0001.pdf');

-- Reviews
INSERT INTO reviews (student_id, course_id, rating, comment) VALUES
(4, 3, 5, 'Excellent course, very well explained with practical examples!'),
(4, 1, 4, 'Great content, would love more real-world project examples.'),
(5, 1, 4, 'Good pace and clear explanations of Spring Boot concepts.');
