namespace SmartLearningHub.CertificateService.Domain.Entities;

/// <summary>
/// Represents a generated certificate record stored by the Certificate microservice.
/// This is intentionally separate from the Spring Boot `certificates` table -
/// each service owns its own data; Spring Boot only stores the returned
/// certificate number, pdf path, and student/course ids for its own records.
/// </summary>
public class CertificateRecord
{
    public int Id { get; set; }

    public long StudentId { get; set; }

    public string StudentName { get; set; } = string.Empty;

    public long CourseId { get; set; }

    public string CourseTitle { get; set; } = string.Empty;

    public string InstructorName { get; set; } = string.Empty;

    public string CertificateNumber { get; set; } = string.Empty;

    public string PdfFileName { get; set; } = string.Empty;

    public string PdfPath { get; set; } = string.Empty;

    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
}
