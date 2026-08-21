using SmartLearningHub.CertificateService.Domain.Entities;

namespace SmartLearningHub.CertificateService.Application.Interfaces;

/// <summary>
/// Repository Pattern abstraction over certificate record persistence.
/// The Infrastructure layer provides the EF Core implementation.
/// </summary>
public interface ICertificateRepository
{
    Task<CertificateRecord?> GetByStudentAndCourseAsync(long studentId, long courseId);

    Task<CertificateRecord?> GetByCertificateNumberAsync(string certificateNumber);

    Task<IEnumerable<CertificateRecord>> GetAllForStudentAsync(long studentId);

    Task<CertificateRecord> AddAsync(CertificateRecord record);

    Task<bool> ExistsAsync(long studentId, long courseId);
}
