using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartLearningHub.CertificateService.Application.DTOs;
using SmartLearningHub.CertificateService.Application.Interfaces;
using SmartLearningHub.CertificateService.Domain.Entities;
using SmartLearningHub.CertificateService.Domain.Exceptions;

namespace SmartLearningHub.CertificateService.Application.Services;

/// <summary>
/// Orchestrates certificate generation: validates uniqueness, generates a
/// certificate number, renders the PDF via IPdfGenerator, and persists the
/// record via ICertificateRepository. Depends only on abstractions, per
/// Clean Architecture / Dependency Inversion.
/// </summary>
public class CertificateGenerationService : ICertificateGenerationService
{
    private readonly ICertificateRepository _repository;
    private readonly IPdfGenerator _pdfGenerator;
    private readonly IConfiguration _configuration;
    private readonly ILogger<CertificateGenerationService> _logger;

    public CertificateGenerationService(
        ICertificateRepository repository,
        IPdfGenerator pdfGenerator,
        IConfiguration configuration,
        ILogger<CertificateGenerationService> logger)
    {
        _repository = repository;
        _pdfGenerator = pdfGenerator;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<CertificateGenerationResponse> GenerateCertificateAsync(CertificateGenerationRequest request)
    {
        if (await _repository.ExistsAsync(request.StudentId, request.CourseId))
        {
            _logger.LogWarning(
                "Duplicate certificate generation attempt for student {StudentId} / course {CourseId}",
                request.StudentId, request.CourseId);
            throw new DuplicateCertificateException(request.StudentId, request.CourseId);
        }

        string certificateNumber = GenerateCertificateNumber();

        var record = new CertificateRecord
        {
            StudentId = request.StudentId,
            StudentName = request.StudentName,
            CourseId = request.CourseId,
            CourseTitle = request.CourseTitle,
            InstructorName = request.InstructorName,
            CertificateNumber = certificateNumber,
            IssueDate = DateTime.UtcNow
        };

        string pdfPath = _pdfGenerator.GenerateCertificatePdf(record);
        record.PdfPath = pdfPath;
        record.PdfFileName = Path.GetFileName(pdfPath);

        var saved = await _repository.AddAsync(record);

        string baseUrl = _configuration["App:BaseUrl"] ?? "http://localhost:5000";
        string downloadUrl = $"{baseUrl}/api/certificates/download/{saved.CertificateNumber}";

        _logger.LogInformation(
            "Certificate {CertificateNumber} generated for student {StudentId} on course {CourseId}",
            saved.CertificateNumber, saved.StudentId, saved.CourseId);

        return new CertificateGenerationResponse
        {
            CertificateNumber = saved.CertificateNumber,
            PdfPath = saved.PdfPath,
            DownloadUrl = downloadUrl
        };
    }

    public async Task<IEnumerable<CertificateRecordResponse>> GetCertificatesForStudentAsync(long studentId)
    {
        var records = await _repository.GetAllForStudentAsync(studentId);
        string baseUrl = _configuration["App:BaseUrl"] ?? "http://localhost:5000";

        return records.Select(r => new CertificateRecordResponse
        {
            Id = r.Id,
            StudentId = r.StudentId,
            StudentName = r.StudentName,
            CourseId = r.CourseId,
            CourseTitle = r.CourseTitle,
            CertificateNumber = r.CertificateNumber,
            DownloadUrl = $"{baseUrl}/api/certificates/download/{r.CertificateNumber}",
            IssueDate = r.IssueDate
        });
    }

    public async Task<CertificateRecordResponse?> GetByCertificateNumberAsync(string certificateNumber)
    {
        var record = await _repository.GetByCertificateNumberAsync(certificateNumber);
        if (record is null)
        {
            return null;
        }

        string baseUrl = _configuration["App:BaseUrl"] ?? "http://localhost:5000";
        return new CertificateRecordResponse
        {
            Id = record.Id,
            StudentId = record.StudentId,
            StudentName = record.StudentName,
            CourseId = record.CourseId,
            CourseTitle = record.CourseTitle,
            CertificateNumber = record.CertificateNumber,
            DownloadUrl = $"{baseUrl}/api/certificates/download/{record.CertificateNumber}",
            IssueDate = record.IssueDate
        };
    }

    private static string GenerateCertificateNumber()
    {
        // e.g. CERT-2026-8F3A1C2B
        string year = DateTime.UtcNow.Year.ToString();
        string unique = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
        return $"CERT-{year}-{unique}";
    }
}
