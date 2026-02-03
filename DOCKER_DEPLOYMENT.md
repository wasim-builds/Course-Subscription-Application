# 🐳 Docker Deployment Guide

## Overview

This guide covers deploying the Course Subscription Application using Docker containers. Docker provides a consistent environment across development, testing, and production.

## Prerequisites

- Docker installed (v20.10+)
- Docker Compose installed (v2.0+)
- MongoDB Atlas account OR local MongoDB

## Quick Start with Docker Compose

### 1. Clone and Configure

```bash
# Clone repository
git clone <your-repo-url>
cd Course-Subscription-Application

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
nano .env
```

### 2. Start All Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 4. Seed Database (First Time Only)

```bash
# Run seed script inside backend container
docker-compose exec backend npm run seed
```

### 5. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Manual Docker Build

### Build Images

```bash
# Build backend image
docker build -t course-app-backend:latest ./backend

# Build frontend image
docker build -t course-app-frontend:latest ./frontend
```

### Run Containers

```bash
# Create network
docker network create course-app-network

# Run backend
docker run -d \
  --name course-app-backend \
  --network course-app-network \
  -p 5000:5000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e NODE_ENV=production \
  course-app-backend:latest

# Run frontend
docker run -d \
  --name course-app-frontend \
  --network course-app-network \
  -p 80:80 \
  course-app-frontend:latest
```

---

## Cloud Platform Deployment

### AWS ECS (Elastic Container Service)

1. **Push images to ECR**:
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Tag images
   docker tag course-app-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/course-app-backend:latest
   docker tag course-app-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/course-app-frontend:latest
   
   # Push images
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/course-app-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/course-app-frontend:latest
   ```

2. **Create ECS Task Definitions** for backend and frontend
3. **Create ECS Service** with load balancer
4. **Configure environment variables** in task definition

### Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/course-app-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT-ID/course-app-frontend ./frontend

# Deploy backend
gcloud run deploy course-app-backend \
  --image gcr.io/PROJECT-ID/course-app-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="your_uri",JWT_SECRET="your_secret"

# Deploy frontend
gcloud run deploy course-app-frontend \
  --image gcr.io/PROJECT-ID/course-app-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Select "Docker Compose" as deployment method
3. Configure environment variables
4. Deploy

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secure_random_string` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend port | `5000` |

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps
```

### Database connection issues

```bash
# Test MongoDB connection
docker-compose exec backend node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Port already in use

```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :5000

# Kill process or change port in docker-compose.yml
```

### Rebuild after code changes

```bash
# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build backend
```

---

## Production Best Practices

### 1. Use Multi-Stage Builds
✅ Already implemented in Dockerfiles

### 2. Run as Non-Root User
✅ Already implemented in backend Dockerfile

### 3. Health Checks
✅ Already implemented in both services

### 4. Resource Limits

Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 5. Logging

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 6. Security Scanning

```bash
# Scan images for vulnerabilities
docker scan course-app-backend:latest
docker scan course-app-frontend:latest
```

---

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats course-app-backend
```

---

## Backup and Restore

### Backup MongoDB (if using local MongoDB)

```bash
# Backup
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup to host
docker cp course-app-mongodb:/data/backup ./mongodb-backup
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup course-app-mongodb:/data/restore

# Restore
docker-compose exec mongodb mongorestore /data/restore
```

---

## Scaling

### Scale with Docker Compose

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Note: You'll need a load balancer for this to work properly
```

---

## Useful Commands

```bash
# View all containers
docker ps -a

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a

# Execute command in running container
docker-compose exec backend sh

# View container details
docker inspect course-app-backend
```

---

## Next Steps

1. Set up CI/CD pipeline for automated builds
2. Configure monitoring (Prometheus, Grafana)
3. Set up log aggregation (ELK stack)
4. Implement automated backups
5. Configure SSL/TLS certificates

---

## Support

For issues or questions:
- Check container logs: `docker-compose logs`
- Verify environment variables: `docker-compose config`
- Test health endpoints: `curl http://localhost:5000/api/health`
