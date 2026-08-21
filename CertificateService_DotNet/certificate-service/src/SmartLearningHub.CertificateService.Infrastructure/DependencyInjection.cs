using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartLearningHub.CertificateService.Application.Interfaces;
using SmartLearningHub.CertificateService.Application.Services;
using SmartLearningHub.CertificateService.Infrastructure.Persistence;
using SmartLearningHub.CertificateService.Infrastructure.Persistence.Repositories;
using SmartLearningHub.CertificateService.Infrastructure.Pdf;

namespace SmartLearningHub.CertificateService.Infrastructure;

/// <summary>
/// Wires up Infrastructure and Application services for DI, keeping
/// Program.cs (the composition root) small and readable.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<CertificateDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        services.AddScoped<ICertificateRepository, CertificateRepository>();
        services.AddSingleton<IPdfGenerator, QuestPdfCertificateGenerator>();
        services.AddScoped<ICertificateGenerationService, CertificateGenerationService>();

        return services;
    }
}
