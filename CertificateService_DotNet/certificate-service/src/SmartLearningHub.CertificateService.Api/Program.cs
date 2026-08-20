using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using SmartLearningHub.CertificateService.Api.Middleware;
using SmartLearningHub.CertificateService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------
// Services
// ---------------------------------------------------------------

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Match Jackson's default camelCase serialization used by the
        // Spring Boot backend (studentId, courseTitle, etc.)
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Smart Learning Hub - Certificate Service",
        Version = "v1",
        Description = "ASP.NET Core 8 microservice responsible for generating and serving course completion certificates."
    });
});

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpringBootAndFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration
            .GetSection("App:AllowedOrigins")
            .Get<string[]>() ?? new[] { "http://localhost:3000", "http://localhost:8080" };

        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ---------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------

app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Learning Hub Certificate Service v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowSpringBootAndFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
