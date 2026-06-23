package com.smartlearninghub.controller;

import com.smartlearninghub.dto.certificate.CertificateResponse;
import com.smartlearninghub.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student/certificates")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Certificates", description = "Certificate issuance via the .NET Certificate microservice")
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/courses/{courseId}")
    @Operation(summary = "Request certificate issuance for a completed, passed course")
    public ResponseEntity<CertificateResponse> issueCertificate(@PathVariable Long courseId,
                                                                   Authentication authentication) {
        CertificateResponse response = certificateService.issueCertificate(authentication.getName(), courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get all certificates earned by the current student")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(Authentication authentication) {
        return ResponseEntity.ok(certificateService.getMyCertificates(authentication.getName()));
    }

    @GetMapping("/courses/{courseId}")
    @Operation(summary = "Get the certificate for a specific course, if issued")
    public ResponseEntity<CertificateResponse> getCertificateForCourse(@PathVariable Long courseId,
                                                                          Authentication authentication) {
        return ResponseEntity.ok(certificateService.getCertificateForCourse(authentication.getName(), courseId));
    }
}
