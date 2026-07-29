using Microsoft.EntityFrameworkCore;
using SmartLearningHub.CertificateService.Application.Interfaces;
using SmartLearningHub.CertificateService.Domain.Entities;
using SmartLearningHub.CertificateService.Infrastructure.Persistence;

namespace SmartLearningHub.CertificateService.Infrastructure.Persistence.Repositories;

/// <summary>
/// EF Core implementation of ICertificateRepository (Repository Pattern).
/// </summary>
public class CertificateRepository : ICertificateRepository
{
    private readonly CertificateDbContext _context;

    public CertificateRepository(CertificateDbContext context)
    {
        _context = context;
    }

    public async Task<CertificateRecord?> GetByStudentAndCourseAsync(long studentId, long courseId)
    {
        return await _context.CertificateRecords
            .FirstOrDefaultAsync(c => c.StudentId == studentId && c.CourseId == courseId);
    }

    public async Task<CertificateRecord?> GetByCertificateNumberAsync(string certificateNumber)
    {
        return await _context.CertificateRecords
            .FirstOrDefaultAsync(c => c.CertificateNumber == certificateNumber);
    }

    public async Task<IEnumerable<CertificateRecord>> GetAllForStudentAsync(long studentId)
    {
        return await _context.CertificateRecords
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.IssueDate)
            .ToListAsync();
    }

    public async Task<CertificateRecord> AddAsync(CertificateRecord record)
    {
        _context.CertificateRecords.Add(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<bool> ExistsAsync(long studentId, long courseId)
    {
        return await _context.CertificateRecords
            .AnyAsync(c => c.StudentId == studentId && c.CourseId == courseId);
    }
}
