using SmartLearningHub.CertificateService.Domain.Entities;

namespace SmartLearningHub.CertificateService.Application.Interfaces;

/// <summary>
/// Abstraction over PDF rendering so the certificate template/engine can be
/// swapped (e.g. QuestPDF today, a different renderer later) without
/// touching the orchestration logic in CertificateGenerationService.
/// </summary>
public interface IPdfGenerator
{
    /// <summary>
    /// Renders a certificate PDF to disk and returns the absolute file path.
    /// </summary>
    string GenerateCertificatePdf(CertificateRecord record);
}
