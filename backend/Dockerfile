# Use the official .NET 9.0 runtime image as base
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 7010

# Use the official .NET 9.0 SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY NextStep.csproj .
RUN dotnet restore

# Copy the source code and build the application
COPY . .
RUN dotnet build -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Final stage: runtime image
FROM base AS final
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r nextstep && useradd -r -g nextstep nextstep

# Copy the published application
COPY --from=publish /app/publish .

# Create directory for SQLite database and set permissions
RUN mkdir -p /app/data && chown -R nextstep:nextstep /app

# Switch to non-root user
USER nextstep

# Set environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:7010

ENTRYPOINT ["dotnet", "NextStep.dll"]
