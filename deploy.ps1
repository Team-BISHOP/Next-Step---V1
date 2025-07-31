# NextStep Docker Deployment Script for Windows
param(
    [string]$Environment = "development",
    [string]$Action = "up",
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\deploy.ps1 [OPTIONS]"
    Write-Host "Options:"
    Write-Host "  -Environment development|production    Set deployment environment (default: development)"
    Write-Host "  -Action up|down|build|logs             Docker Compose action (default: up)"
    Write-Host "  -Help                                  Show this help message"
    exit 0
}

Write-Host "🚀 Starting NextStep Application Deployment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
}
catch {
    Write-Host "❌ Error: Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose --version | Out-Null
}
catch {
    Write-Host "❌ Error: Docker Compose is not available. Please install Docker Compose and try again." -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Environment: $Environment" -ForegroundColor Yellow
Write-Host "🔧 Action: $Action" -ForegroundColor Yellow

# Set Docker Compose files based on environment
$ComposeFiles = "-f docker-compose.yml"
if ($Environment -eq "production") {
    $ComposeFiles = "$ComposeFiles -f docker-compose.prod.yml"
    Write-Host "📋 Using production configuration" -ForegroundColor Blue
}

# Execute Docker Compose command
switch ($Action) {
    "up" {
        Write-Host "🚀 Starting containers..." -ForegroundColor Green
        Invoke-Expression "docker-compose $ComposeFiles up -d"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers started successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📱 Frontend: http://localhost:8080" -ForegroundColor Cyan
            Write-Host "🔧 Backend API: http://localhost:7010" -ForegroundColor Cyan
            Write-Host "📚 API Documentation: http://localhost:7010/swagger" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "📊 To view logs: docker-compose logs -f" -ForegroundColor Yellow
            Write-Host "🛑 To stop: docker-compose down" -ForegroundColor Yellow
        }
    }
    "down" {
        Write-Host "🛑 Stopping containers..." -ForegroundColor Yellow
        Invoke-Expression "docker-compose $ComposeFiles down"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers stopped successfully!" -ForegroundColor Green
        }
    }
    "build" {
        Write-Host "🔨 Building containers..." -ForegroundColor Blue
        Invoke-Expression "docker-compose $ComposeFiles build"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers built successfully!" -ForegroundColor Green
        }
    }
    "logs" {
        Write-Host "📊 Showing logs..." -ForegroundColor Blue
        Invoke-Expression "docker-compose $ComposeFiles logs -f"
    }
    default {
        Write-Host "❌ Unknown action: $Action" -ForegroundColor Red
        Write-Host "Available actions: up, down, build, logs" -ForegroundColor Yellow
        exit 1
    }
}
