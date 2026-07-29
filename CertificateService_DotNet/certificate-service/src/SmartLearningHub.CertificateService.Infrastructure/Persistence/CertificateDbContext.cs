using Microsoft.EntityFrameworkCore;
using SmartLearningHub.CertificateService.Domain.Entities;

namespace SmartLearningHub.CertificateService.Infrastructure.Persistence;

public class CertificateDbContext : DbContext
{
    public CertificateDbContext(DbContextOptions<CertificateDbContext> options)
        : base(options)
    {
    }

    public DbSet<CertificateRecord> CertificateRecords => Set<CertificateRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CertificateRecord>(entity =>
        {
            entity.ToTable("certificate_records");

            entity.HasKey(e => e.Id);

            // Column mappings (C# property -> MySQL column)
            entity.Property(e => e.Id)
                .HasColumnName("id");

            entity.Property(e => e.StudentId)
                .HasColumnName("student_id");

            entity.Property(e => e.StudentName)
                .HasColumnName("student_name")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(e => e.CourseId)
                .HasColumnName("course_id");

            entity.Property(e => e.CourseTitle)
                .HasColumnName("course_title")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.InstructorName)
                .HasColumnName("instructor_name")
                .HasMaxLength(150);

            entity.Property(e => e.CertificateNumber)
                .HasColumnName("certificate_number")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.PdfFileName)
                .HasColumnName("pdf_file_name")
                .HasMaxLength(255);

            entity.Property(e => e.PdfPath)
                .HasColumnName("pdf_path")
                .HasMaxLength(500);

            entity.Property(e => e.IssueDate)
                .HasColumnName("issue_date");

            // Unique constraints
            entity.HasIndex(e => e.CertificateNumber)
                .IsUnique();

            entity.HasIndex(e => new { e.StudentId, e.CourseId })
                .IsUnique();
        });
    }
}