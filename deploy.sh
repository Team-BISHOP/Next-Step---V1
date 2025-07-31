#!/bin/bash

# NextStep Docker Deployment Script

set -e

echo "🚀 Starting NextStep Application Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Parse command line arguments
ENVIRONMENT="development"
ACTION="up"

while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --action)
            ACTION="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --env development|production    Set deployment environment (default: development)"
            echo "  --action up|down|build|logs     Docker Compose action (default: up)"
            echo "  --help                          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo "🔧 Environment: $ENVIRONMENT"
echo "🔧 Action: $ACTION"

# Set Docker Compose files based on environment
COMPOSE_FILES="-f docker-compose.yml"
if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.prod.yml"
    echo "📋 Using production configuration"
fi

# Execute Docker Compose command
case $ACTION in
    up)
        echo "🚀 Starting containers..."
        docker-compose $COMPOSE_FILES up -d
        echo "✅ Containers started successfully!"
        echo ""
        echo "📱 Frontend: http://localhost:8080"
        echo "🔧 Backend API: http://localhost:7010"
        echo "📚 API Documentation: http://localhost:7010/swagger"
        echo ""
        echo "📊 To view logs: docker-compose logs -f"
        echo "🛑 To stop: docker-compose down"
        ;;
    down)
        echo "🛑 Stopping containers..."
        docker-compose $COMPOSE_FILES down
        echo "✅ Containers stopped successfully!"
        ;;
    build)
        echo "🔨 Building containers..."
        docker-compose $COMPOSE_FILES build
        echo "✅ Containers built successfully!"
        ;;
    logs)
        echo "📊 Showing logs..."
        docker-compose $COMPOSE_FILES logs -f
        ;;
    *)
        echo "❌ Unknown action: $ACTION"
        echo "Available actions: up, down, build, logs"
        exit 1
        ;;
esac
