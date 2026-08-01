using SmartLearningHub.CertificateService.Application.DTOs;

namespace SmartLearningHub.CertificateService.Application.Interfaces;

public interface ICertificateGenerationService
{
    Task<CertificateGenerationResponse> GenerateCertificateAsync(CertificateGenerationRequest request);

    Task<IEnumerable<CertificateRecordResponse>> GetCertificatesForStudentAsync(long studentId);

    Task<CertificateRecordResponse?> GetByCertificateNumberAsync(string certificateNumber);
}
