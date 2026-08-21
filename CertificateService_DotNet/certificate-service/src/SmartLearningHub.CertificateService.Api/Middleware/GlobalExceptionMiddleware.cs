using System.Net;
using System.Text.Json;
using SmartLearningHub.CertificateService.Domain.Exceptions;

namespace SmartLearningHub.CertificateService.Api.Middleware;

/// <summary>
/// Centralized exception handling, mirroring the Spring Boot side's
/// GlobalExceptionHandler so both services return a consistent error shape.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DuplicateCertificateException ex)
        {
            _logger.LogWarning(ex, "Duplicate certificate request");
            await WriteErrorAsync(context, HttpStatusCode.Conflict, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Path}", context.Request.Path);
            await WriteErrorAsync(context, HttpStatusCode.InternalServerError,
                "An unexpected error occurred. Please try again later.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var payload = new
        {
            timestamp = DateTime.UtcNow,
            status = (int)statusCode,
            error = statusCode.ToString(),
            message,
            path = context.Request.Path.Value
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}
