FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY src/SmartLearningHub.CertificateService.Api/SmartLearningHub.CertificateService.Api.csproj src/SmartLearningHub.CertificateService.Api/
COPY src/SmartLearningHub.CertificateService.Application/SmartLearningHub.CertificateService.Application.csproj src/SmartLearningHub.CertificateService.Application/
COPY src/SmartLearningHub.CertificateService.Infrastructure/SmartLearningHub.CertificateService.Infrastructure.csproj src/SmartLearningHub.CertificateService.Infrastructure/
COPY src/SmartLearningHub.CertificateService.Domain/SmartLearningHub.CertificateService.Domain.csproj src/SmartLearningHub.CertificateService.Domain/

RUN dotnet restore src/SmartLearningHub.CertificateService.Api/SmartLearningHub.CertificateService.Api.csproj

COPY src/ src/

RUN dotnet publish src/SmartLearningHub.CertificateService.Api/SmartLearningHub.CertificateService.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}

ENTRYPOINT ["dotnet", "SmartLearningHub.CertificateService.Api.dll"]