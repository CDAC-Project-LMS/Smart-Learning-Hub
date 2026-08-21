using Microsoft.Extensions.Configuration;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SmartLearningHub.CertificateService.Application.Interfaces;
using SmartLearningHub.CertificateService.Domain.Entities;

namespace SmartLearningHub.CertificateService.Infrastructure.Pdf;

/// <summary>
/// Renders a certificate PDF using QuestPDF (MIT/Community license, no
/// external native dependencies). Implements IPdfGenerator so the rendering
/// engine can be swapped without touching the Application layer.
/// </summary>
public class QuestPdfCertificateGenerator : IPdfGenerator
{
    private readonly string _outputDirectory;

    public QuestPdfCertificateGenerator(IConfiguration configuration)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        _outputDirectory = configuration["App:CertificateStorageDirectory"] ?? "GeneratedCertificates";
        Directory.CreateDirectory(_outputDirectory);
    }

    public string GenerateCertificatePdf(CertificateRecord record)
    {
        string fileName = $"{record.CertificateNumber}.pdf";
        string filePath = Path.Combine(_outputDirectory, fileName);

        Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontFamily("Helvetica"));

                page.Content().Border(2).BorderColor(Colors.Blue.Darken2).Padding(30).Column(column =>
                {
                    column.Spacing(15);

                    column.Item().AlignCenter().Text("Smart Learning Hub")
                        .FontSize(22).Bold().FontColor(Colors.Blue.Darken3);

                    column.Item().AlignCenter().Text("Certificate of Completion")
                        .FontSize(28).Bold();

                    column.Item().AlignCenter().PaddingTop(10).Text("This certifies that").FontSize(14);

                    column.Item().AlignCenter().Text(record.StudentName)
                        .FontSize(24).Bold().FontColor(Colors.Blue.Darken2);

                    column.Item().AlignCenter().Text("has successfully completed the course").FontSize(14);

                    column.Item().AlignCenter().Text(record.CourseTitle)
                        .FontSize(20).Bold();

                    if (!string.IsNullOrWhiteSpace(record.InstructorName))
                    {
                        column.Item().AlignCenter().Text($"Instructor: {record.InstructorName}").FontSize(12);
                    }

                    column.Item().PaddingTop(25).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text($"Certificate No: {record.CertificateNumber}").FontSize(10);
                            c.Item().Text($"Issue Date: {record.IssueDate:dd MMM yyyy}").FontSize(10);
                        });

                        row.RelativeItem().AlignRight().Column(c =>
                        {
                            c.Item().AlignRight().Text("Smart Learning Hub").FontSize(12).Bold();
                            c.Item().AlignRight().Text("Authorized Signature").FontSize(9);
                        });
                    });
                });
            });
        }).GeneratePdf(filePath);

        return Path.GetFullPath(filePath);
    }
}
