package com.smartlearninghub.service;

import com.smartlearninghub.dto.lesson.LessonRequest;
import com.smartlearninghub.dto.lesson.LessonResponse;

import java.util.List;

public interface LessonService {

    LessonResponse addLesson(String instructorEmail, Long courseId, LessonRequest request);

    LessonResponse updateLesson(String instructorEmail, Long lessonId, LessonRequest request);

    void deleteLesson(String instructorEmail, Long lessonId);

    List<LessonResponse> getLessonsForCourse(Long courseId, String studentEmail);

    LessonResponse markLessonComplete(String studentEmail, Long lessonId);
}
