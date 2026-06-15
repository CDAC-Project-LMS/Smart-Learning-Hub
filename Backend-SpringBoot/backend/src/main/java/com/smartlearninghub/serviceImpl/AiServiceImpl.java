package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.client.AiServiceClient;
import com.smartlearninghub.dto.ai.AiGenerateResponse;
import com.smartlearninghub.dto.ai.ChatRequest;
import com.smartlearninghub.dto.ai.ChatResponse;
import com.smartlearninghub.entity.Course;
import com.smartlearninghub.entity.Lesson;
import com.smartlearninghub.repository.CourseRepository;
import com.smartlearninghub.repository.LessonRepository;
import com.smartlearninghub.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Builds a grounded prompt (course title/description/lesson list, when
 * available) and delegates generation to the Python AI microservice, which
 * talks to whichever LLM provider (Gemini/OpenAI) is configured there.
 * Handles: answering questions, explaining concepts, summarizing lessons,
 * recommending learning paths / next courses, and quiz-prep tips.
 */
@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final AiServiceClient aiServiceClient;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    private static final String SYSTEM_PREAMBLE = """
            You are the Smart Learning Hub AI Learning Assistant. You help students by:
            answering questions, explaining programming and technical concepts clearly,
            summarizing lessons, recommending learning paths, suggesting next courses,
            giving quiz preparation tips, and providing general study guidance.
            Keep answers concise, encouraging, and beginner-friendly unless the student's
            question suggests they want more depth.
            """;

    @Override
    public ChatResponse chat(ChatRequest request) {
        String contextBlock = buildCourseContext(request.getCourseId());

        String prompt = SYSTEM_PREAMBLE
                + (contextBlock.isBlank() ? "" : "\n\nRelevant course context:\n" + contextBlock)
                + "\n\nStudent question: " + request.getMessage();

        AiGenerateResponse generated = aiServiceClient.generate(prompt);

        return ChatResponse.builder()
                .reply(generated.getReply())
                .provider(generated.getProvider())
                .build();
    }

    private String buildCourseContext(Long courseId) {
        if (courseId == null) {
            return "";
        }
        return courseRepository.findById(courseId).map(course -> {
            StringBuilder sb = new StringBuilder();
            sb.append("Course: ").append(course.getTitle()).append("\n");
            if (course.getDescription() != null) {
                sb.append("Description: ").append(course.getDescription()).append("\n");
            }
            List<Lesson> lessons = lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId);
            if (!lessons.isEmpty()) {
                sb.append("Lessons:\n");
                lessons.forEach(l -> sb.append(" - ").append(l.getLessonOrder()).append(". ")
                        .append(l.getTitle()).append("\n"));
            }
            return sb.toString();
        }).orElse("");
    }
}
