

package com.smartlearninghub.serviceImpl;


import com.smartlearninghub.dto.PageResponse;
import com.smartlearninghub.dto.enrollment.EnrollmentResponse;
import com.smartlearninghub.entity.Course;
import com.smartlearninghub.entity.Enrollment;
import com.smartlearninghub.entity.User;
import com.smartlearninghub.exception.BadRequestException;
import com.smartlearninghub.exception.ResourceNotFoundException;
import com.smartlearninghub.exception.UnauthorizedException;
import com.smartlearninghub.repository.CourseRepository;
import com.smartlearninghub.repository.EnrollmentRepository;
import com.smartlearninghub.repository.UserRepository;
import com.smartlearninghub.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;


@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl 
        implements EnrollmentService {


    private final EnrollmentRepository enrollmentRepository;

    private final CourseRepository courseRepository;

    private final UserRepository userRepository;



    @Override
    @Transactional
    public EnrollmentResponse enroll(
            String studentEmail,
            Long courseId
    ){

        User student = getUser(studentEmail);


        Course course =
                courseRepository.findById(courseId)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                            "Course",
                            "id",
                            courseId
                    )
                );


        if(enrollmentRepository
                .existsByStudentIdAndCourseId(
                        student.getId(),
                        courseId
                )){

            throw new BadRequestException(
                    "Already enrolled"
            );
        }



        Enrollment enrollment =
                Enrollment.builder()
                .student(student)
                .course(course)
                .build();



        return toResponse(
                enrollmentRepository.save(enrollment)
        );
    }




    @Override
    @Transactional(readOnly = true)
    public PageResponse<EnrollmentResponse> getMyEnrollments(
            String studentEmail,
            int page,
            int size
    ){

        User student =
                getUser(studentEmail);



        Pageable pageable =
                PageRequest.of(page,size);



        Page<Enrollment> enrollments =
                enrollmentRepository
                .findByStudentId(
                        student.getId(),
                        pageable
                );



        return PageResponse.from(
                enrollments.map(this::toResponse)
        );
    }





    @Override
    @Transactional(readOnly = true)
    public EnrollmentResponse getEnrollmentDetails(
            String studentEmail,
            Long courseId
    ){

        User student =
                getUser(studentEmail);



        Enrollment enrollment =
                enrollmentRepository
                .findByStudentIdAndCourseId(
                        student.getId(),
                        courseId
                )
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                            "Enrollment not found"
                    )
                );


        return toResponse(enrollment);
    }




    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsForCourse(
            String instructorEmail,
            Long courseId
    ){

        Course course =
                courseRepository.findById(courseId)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                            "Course",
                            "id",
                            courseId
                    )
                );



        if(!course.getInstructor()
                .getEmail()
                .equalsIgnoreCase(instructorEmail)){

            throw new UnauthorizedException(
                    "Not allowed"
            );
        }



        return enrollmentRepository
                .findByCourseId(courseId)
                .stream()
                .map(this::toResponse)
                .toList();
    }





    private User getUser(String email){

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                            "User",
                            "email",
                            email
                    )
                );
    }





    private EnrollmentResponse toResponse(
            Enrollment enrollment
    ){

        return EnrollmentResponse.builder()

                .id(enrollment.getId())

                .courseId(
                    enrollment.getCourse().getId()
                )

                .courseTitle(
                    enrollment.getCourse().getTitle()
                )

                .courseImage(
                    enrollment.getCourse().getImage()
                )


                .studentId(
                    enrollment.getStudent().getId()
                )


                .studentName(
                    enrollment.getStudent().getName()
                )


                .status(
                    enrollment.getStatus().name()
                )


                .progressPercentage(
                    enrollment.getProgressPercentage()
                )


                .enrollmentDate(
                    enrollment.getEnrollmentDate()
                )

                .build();
    }
}
