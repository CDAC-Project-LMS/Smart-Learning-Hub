FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY src/ src/

RUN find src -type d \( -name obj -o -name bin \) -prune -exec rm -rf {} +

RUN dotnet restore src/SmartLearningHub.CertificateService.Api/SmartLearningHub.CertificateService.Api.csproj

RUN dotnet publish src/SmartLearningHub.CertificateService.Api/SmartLearningHub.CertificateService.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "SmartLearningHub.CertificateService.Api.dll"]