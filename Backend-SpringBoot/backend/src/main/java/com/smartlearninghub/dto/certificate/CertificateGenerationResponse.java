package com.smartlearninghub.dto.certificate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response payload returned by the ASP.NET Core Certificate microservice
 * after generating a PDF. Field names match the .NET service's JSON contract.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CertificateGenerationResponse {

    private String certificateNumber;
    private String pdfPath;
    private String downloadUrl;
}
