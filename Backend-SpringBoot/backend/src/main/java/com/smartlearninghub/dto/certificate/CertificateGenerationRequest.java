package com.smartlearninghub.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body sent to the ASP.NET Core Certificate microservice.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateGenerationRequest {

    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseTitle;
    private String instructorName;
}
