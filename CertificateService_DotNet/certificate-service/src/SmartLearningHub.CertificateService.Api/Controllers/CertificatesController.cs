using Microsoft.AspNetCore.Mvc;
using SmartLearningHub.CertificateService.Application.DTOs;
using SmartLearningHub.CertificateService.Application.Interfaces;

namespace SmartLearningHub.CertificateService.Api.Controllers;

/// <summary>
/// REST endpoints consumed by the Spring Boot backend's CertificateServiceClient,
/// plus a public download endpoint for the generated PDF.
/// </summary>
[ApiController]
[Route("api/certificates")]
public class CertificatesController : ControllerBase
{
    private readonly ICertificateGenerationService _certificateService;
    private readonly ILogger<CertificatesController> _logger;

    public CertificatesController(
        ICertificateGenerationService certificateService,
        ILogger<CertificatesController> logger)
    {
        _certificateService = certificateService;
        _logger = logger;
    }

    /// <summary>
    /// Called by Spring Boot once a student is verified eligible for a certificate.
    /// Generates the PDF and returns its certificate number, path, and download URL.
    /// </summary>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(CertificateGenerationResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Generate([FromBody] CertificateGenerationRequest request)
    {
        var response = await _certificateService.GenerateCertificateAsync(request);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("student/{studentId:long}")]
    [ProducesResponseType(typeof(IEnumerable<CertificateRecordResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetForStudent(long studentId)
    {
        var records = await _certificateService.GetCertificatesForStudentAsync(studentId);
        return Ok(records);
    }

    [HttpGet("{certificateNumber}")]
    [ProducesResponseType(typeof(CertificateRecordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByCertificateNumber(string certificateNumber)
    {
        var record = await _certificateService.GetByCertificateNumberAsync(certificateNumber);
        if (record is null)
        {
            return NotFound(new { message = $"No certificate found with number '{certificateNumber}'" });
        }
        return Ok(record);
    }

    /// <summary>
    /// Serves the generated PDF file directly so the frontend's "Download
    /// Certificate" button can link straight to this URL.
    /// </summary>
    [HttpGet("download/{certificateNumber}")]
    public async Task<IActionResult> Download(string certificateNumber)
    {
        var record = await _certificateService.GetByCertificateNumberAsync(certificateNumber);
        if (record is null)
        {
            return NotFound(new { message = $"No certificate found with number '{certificateNumber}'" });
        }

        // The service layer only returns metadata; re-resolve the physical
        // path via the same naming convention used at generation time.
        string storageDir = HttpContext.RequestServices
            .GetRequiredService<IConfiguration>()["App:CertificateStorageDirectory"] ?? "GeneratedCertificates";
        string filePath = Path.Combine(storageDir, $"{record.CertificateNumber}.pdf");

        if (!System.IO.File.Exists(filePath))
        {
            _logger.LogError("Certificate PDF missing on disk for {CertificateNumber}", certificateNumber);
            return NotFound(new { message = "Certificate file not found on server" });
        }

        byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        return File(fileBytes, "application/pdf", $"{record.CertificateNumber}.pdf");
    }
}
