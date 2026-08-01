using System.ComponentModel.DataAnnotations;

namespace SmartLearningHub.CertificateService.Application.DTOs;

/// <summary>
/// Incoming request from the Spring Boot backend, matching the JSON shape
/// produced by CertificateGenerationRequest.java.
/// </summary>
public class CertificateGenerationRequest
{
    [Required]
    public long StudentId { get; set; }

    [Required]
    public string StudentName { get; set; } = string.Empty;

    [Required]
    public long CourseId { get; set; }

    [Required]
    public string CourseTitle { get; set; } = string.Empty;

    public string InstructorName { get; set; } = string.Empty;
}
