package com.smartlearninghub.serviceImpl;

import com.smartlearninghub.client.CertificateServiceClient;

import com.smartlearninghub.dto.certificate.CertificateGenerationRequest;
import com.smartlearninghub.dto.certificate.CertificateGenerationResponse;
import com.smartlearninghub.dto.certificate.CertificateResponse;
import com.smartlearninghub.entity.*;
import com.smartlearninghub.exception.BadRequestException;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.repository.*;
import com.smartlearninghub.service.CertificateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CertificateServiceClient certificateServiceClient;


    @Override
    @Transactional
    public CertificateResponse issueCertificate(String studentEmail, Long courseId) {

        log.info("Certificate request received. Email={}, CourseId={}",
                studentEmail, courseId);


        // Find student
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                studentEmail
                        ));


        // Find course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course",
                                "id",
                                courseId
                        ));


        // Check duplicate certificate
        certificateRepository
                .findByStudentIdAndCourseId(student.getId(), courseId)
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "Certificate already issued for this course"
                    );
                });


        // Check eligibility
        verifyEligibility(student.getId(), course);


        String instructorName = "Unknown";

        if(course.getInstructor() != null){
            instructorName = course.getInstructor().getName();
        }


        CertificateGenerationRequest request =
                CertificateGenerationRequest.builder()
                        .studentId(student.getId())
                        .studentName(student.getName())
                        .courseId(course.getId())
                        .courseTitle(course.getTitle())
                        .instructorName(instructorName)
                        .build();



        log.info(
                "Calling certificate microservice with data: {}",
                request
        );


        CertificateGenerationResponse response;


        try {

            response =
                    certificateServiceClient.generateCertificate(request);


            log.info(
                    "Certificate service response received. CertificateNo={}",
                    response.getCertificateNumber()
            );


        } catch (Exception e){

            log.error(
                    "Certificate microservice call failed",
                    e
            );

            throw new BadRequestException(
                    "Certificate service is currently unavailable"
            );
        }



        Certificate certificate =
                Certificate.builder()
                        .student(student)
                        .course(course)
                        .certificateNumber(
                                response.getCertificateNumber()
                        )
                        .pdfPath(
                                response.getPdfPath()
                        )
                        .build();



        Certificate saved =
                certificateRepository.save(certificate);



        log.info(
                "Certificate saved successfully. Number={}, Student={}, Course={}",
                saved.getCertificateNumber(),
                studentEmail,
                courseId
        );


        return toResponse(
                saved,
                response.getDownloadUrl()
        );
    }



    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponse> getMyCertificates(String studentEmail) {


        User student =
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User",
                                        "email",
                                        studentEmail
                                ));


        return certificateRepository.findAllByStudentId(student.getId())
                .stream()
                .map(cert ->
                toResponse(
                        cert,
                        "http://localhost:5000/api/certificates/download/" + cert.getCertificateNumber()
                ))
                .toList();
    }



    @Override
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateForCourse(
            String studentEmail,
            Long courseId) {


        User student =
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User",
                                        "email",
                                        studentEmail
                                ));


        Certificate certificate =
                certificateRepository
                        .findByStudentIdAndCourseId(
                                student.getId(),
                                courseId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No certificate found for this course"
                                ));


        return toResponse(
                certificate,
                "http://localhost:5000/api/certificates/download/" + certificate.getCertificateNumber()
        );
    }




    private void verifyEligibility(
            Long studentId,
            Course course) {


        Enrollment enrollment =
                enrollmentRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                course.getId()
                        )

                        .orElseThrow(() ->
                                new BadRequestException(
                                        "You are not enrolled in this course"
                                ));



        if(enrollment.getStatus()
                != EnrollmentStatus.COMPLETED){

            throw new BadRequestException(
                    "Complete all lessons before requesting certificate"
            );
        }



        List<Quiz> quizzes =
                quizRepository.findByCourseId(
                        course.getId()
                );



        for(Quiz quiz : quizzes){


            boolean passed =
                    quizAttemptRepository
                            .existsByStudentIdAndQuizIdAndPassedTrue(
                                    studentId,
                                    quiz.getId()
                            );


            if(!passed){

                throw new BadRequestException(
                        "You must pass all quizzes before requesting certificate"
                );
            }
        }
    }





    private CertificateResponse toResponse(
            Certificate certificate,
            String downloadUrl) {


        return CertificateResponse.builder()

                .id(certificate.getId())

                .courseId(
                        certificate.getCourse().getId()
                )

                .courseTitle(
                        certificate.getCourse().getTitle()
                )

                .studentName(
                        certificate.getStudent().getName()
                )

                .certificateNumber(
                        certificate.getCertificateNumber()
                )

                .downloadUrl(downloadUrl)

                .issueDate(
                        certificate.getIssueDate()
                )

                .build();
    }

}