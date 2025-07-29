# NextStep Docker Setup

This guide will help you run the complete NextStep application using Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Option 1: Using the startup script (Windows)

```powershell
# Run the startup script
.\start-docker.bat
```

### Option 2: Manual setup

```powershell
# Clone the repository and navigate to the project root
cd e:\NextStep

# Build and start all services
docker-compose up --build -d

# View logs (optional)
docker-compose logs -f
```

## Service URLs

Once the containers are running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/swagger
- **Health Check**: http://localhost:8080/health

## Docker Compose Services

### Backend Service

- **Container**: `nextstep-backend`
- **Port**: 8080
- **Technology**: .NET 9.0 Web API
- **Database**: SQLite (persistent volume)
- **Features**: JWT Authentication, Swagger documentation

### Frontend Service

- **Container**: `nextstep-frontend`
- **Port**: 3000
- **Technology**: React + Vite + TypeScript
- **Web Server**: Nginx
- **Features**: SPA routing, API proxy

## Useful Commands

### Start services

```powershell
docker-compose up -d
```

### Stop services

```powershell
docker-compose down
```

### View logs

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild and restart

```powershell
docker-compose up --build -d
```

### Clean up (removes containers and volumes)

```powershell
docker-compose down --volumes --remove-orphans
```

### Check service status

```powershell
docker-compose ps
```

## Development Workflow

### Making changes to the backend

1. Make your changes to the backend code
2. Rebuild the backend service:
   ```powershell
   docker-compose up --build -d backend
   ```

### Making changes to the frontend

1. Make your changes to the frontend code
2. Rebuild the frontend service:
   ```powershell
   docker-compose up --build -d frontend
   ```

## Troubleshooting

### Containers won't start

1. Check if ports 3000 and 8080 are available
2. Ensure Docker Desktop is running
3. Check the logs: `docker-compose logs`

### Database issues

1. Remove the volume and restart:
   ```powershell
   docker-compose down --volumes
   docker-compose up --build -d
   ```

### API connection issues

1. Check if backend is running: `docker-compose ps`
2. Verify API is accessible: http://localhost:8080/health
3. Check CORS configuration in backend

### Frontend build issues

1. Check if node_modules are properly installed
2. Verify environment variables are set correctly
3. Check frontend logs: `docker-compose logs frontend`

## Environment Variables

### Backend

- `ASPNETCORE_ENVIRONMENT`: Set to "Production"
- `ASPNETCORE_URLS`: Set to "http://+:8080"
- `ConnectionStrings__DefaultConnection`: SQLite connection string

### Frontend

- `VITE_API_URL`: Backend API URL (build-time variable)

## Data Persistence

The SQLite database is stored in a Docker volume named `nextstep-data`. This ensures your data persists between container restarts.

To backup the database:

```powershell
docker run --rm -v nextstep-data:/data -v ${PWD}:/backup alpine tar czf /backup/database-backup.tar.gz -C /data .
```

To restore the database:

```powershell
docker run --rm -v nextstep-data:/data -v ${PWD}:/backup alpine tar xzf /backup/database-backup.tar.gz -C /data
```

## Network Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│  (port 3000)    │    │   (port 8080)   │
│                 │    │                 │
│  Nginx          │────│  .NET 9.0 API   │
│  React App      │    │  SQLite DB      │
└─────────────────┘    └─────────────────┘
        │                       │
        └───────────────────────┘
              Docker Network
```

The frontend Nginx server proxies API requests to the backend container, eliminating CORS issues in production.
