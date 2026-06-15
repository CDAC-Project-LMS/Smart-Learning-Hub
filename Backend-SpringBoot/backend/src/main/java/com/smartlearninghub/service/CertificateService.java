package com.smartlearninghub.service;

import com.smartlearninghub.dto.certificate.CertificateResponse;

import java.util.List;

public interface CertificateService {

    CertificateResponse issueCertificate(String studentEmail, Long courseId);

    List<CertificateResponse> getMyCertificates(String studentEmail);

    CertificateResponse getCertificateForCourse(String studentEmail, Long courseId);
}
