namespace SmartLearningHub.CertificateService.Application.DTOs;

/// <summary>
/// Response returned to the Spring Boot backend after a certificate is
/// generated, matching CertificateGenerationResponse.java field names.
/// </summary>
public class CertificateGenerationResponse
{
    public string CertificateNumber { get; set; } = string.Empty;

    public string PdfPath { get; set; } = string.Empty;

    public string DownloadUrl { get; set; } = string.Empty;
}
