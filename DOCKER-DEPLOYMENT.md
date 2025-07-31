# NextStep Docker Deployment Guide

## Overview
This guide provides instructions for deploying the NextStep full-stack application using Docker containers. The application consists of:

- **Backend**: .NET 9.0 API running on port 7010
- **Frontend**: React/Vite application running on port 8080 with Nginx

## Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- At least 1GB disk space

## Quick Start

### 1. Local Development
```bash
# Clone the repository
git clone <repository-url>
cd NextStep

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 2. Production Deployment
```bash
# Using production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or set environment variables
cp .env.example .env
# Edit .env with your production values
docker-compose --env-file .env up -d
```

## Architecture

### Container Communication
- **Internal Network**: Services communicate using service names (`backend`, `frontend`)
- **External Access**: 
  - Frontend: http://localhost:8080
  - Backend API: http://localhost:7010
  - Backend Swagger: http://localhost:7010/swagger

### Security Features
- Non-root user execution in both containers
- Security headers in Nginx
- CORS properly configured for container communication
- Health checks for both services
- Resource limits in production

### Data Persistence
- SQLite database persisted using Docker volume `backend_data`
- Database location: `/app/data/nextstep.db` inside container

## Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT`: Application environment (Production/Development)
- `ConnectionStrings__DefaultConnection`: Database connection string
- `JwtSettings__SecretKey`: JWT signing key (change for production)
- `AppSettings__BaseUrl`: Backend base URL for internal communication

### Frontend
- `VITE_BACKEND_URL`: Backend API URL for frontend communication

## Cloud Deployment

### AWS ECS
```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag nextstep-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nextstep-backend:latest
docker tag nextstep-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nextstep-frontend:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nextstep-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nextstep-frontend:latest
```

### Azure Container Apps
```bash
# Build and push to Azure Container Registry
az acr build --registry <registry-name> --image nextstep-backend:latest ./backend
az acr build --registry <registry-name> --image nextstep-frontend:latest ./frontend
```

### Kubernetes
```bash
# Generate Kubernetes manifests from docker-compose
kompose convert -f docker-compose.yml -f docker-compose.prod.yml
```

## Monitoring and Health Checks

### Health Endpoints
- Backend: `GET /health`
- Frontend: Nginx serves on port 8080

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f backend
```

### Resource Monitoring
```bash
# View resource usage
docker stats

# View container details
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :7010
   netstat -tulpn | grep :8080
   ```

2. **Database Connection Issues**
   ```bash
   # Check volume mount
   docker volume inspect nextstep_backend_data
   
   # Access backend container
   docker-compose exec backend bash
   ls -la /app/data/
   ```

3. **CORS Issues**
   - Ensure frontend uses correct backend URL (`http://backend:7010`)
   - Check CORS configuration in Program.cs

4. **Container Communication**
   ```bash
   # Test internal connectivity
   docker-compose exec frontend wget -qO- http://backend:7010/health
   ```

### Development Tips
```bash
# Rebuild containers after code changes
docker-compose build
docker-compose up -d

# Remove all containers and volumes (fresh start)
docker-compose down -v
docker system prune -a
```

## Production Considerations

### Security
- Change JWT secret key
- Use HTTPS in production
- Configure proper firewall rules
- Regular security updates

### Performance
- Configure nginx worker processes based on CPU cores
- Enable gzip compression (already configured)
- Use CDN for static assets
- Monitor container resources

### Backup
```bash
# Backup database volume
docker run --rm -v nextstep_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/database-backup.tar.gz -C /data .

# Restore database volume
docker run --rm -v nextstep_backend_data:/data -v $(pwd):/backup alpine tar xzf /backup/database-backup.tar.gz -C /data
```

## Support
For issues or questions, please refer to the project documentation or create an issue in the repository.
