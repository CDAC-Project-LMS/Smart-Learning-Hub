namespace SmartLearningHub.CertificateService.Domain.Exceptions;

/// <summary>
/// Thrown when a certificate has already been generated for a given
/// student/course pair, preventing duplicate PDF generation.
/// </summary>
public class DuplicateCertificateException : Exception
{
    public DuplicateCertificateException(long studentId, long courseId)
        : base($"A certificate already exists for student {studentId} and course {courseId}.")
    {
    }
}
