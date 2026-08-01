namespace SmartLearningHub.CertificateService.Application.DTOs;

public class CertificateRecordResponse
{
    public int Id { get; set; }
    public long StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public long CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string CertificateNumber { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; }
}
