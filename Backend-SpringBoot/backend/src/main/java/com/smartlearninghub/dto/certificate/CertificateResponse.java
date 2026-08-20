package com.smartlearninghub.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String studentName;
    private String certificateNumber;
    private String downloadUrl;
    private LocalDateTime issueDate;
}
