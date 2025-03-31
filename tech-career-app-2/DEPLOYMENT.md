# Tech Career Guidance Web Application Deployment Guide

This document provides instructions for deploying the Tech Career Guidance web application.

## Prerequisites

- Docker and Docker Compose installed
- Git installed (for cloning the repository)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tech-career-app
```

### 2. Build the Application

Run the build script to compile both the frontend and backend:

```bash
chmod +x build.sh
./build.sh
```

### 3. Deploy with Docker Compose

Start the application using Docker Compose:

```bash
docker-compose up -d
```

This will start three containers:
- PostgreSQL database
- Spring Boot backend
- React frontend with Nginx

### 4. Access the Application

Once deployed, the application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api

### 5. Monitoring and Logs

To view logs from the containers:

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### 6. Stopping the Application

To stop the application:

```bash
docker-compose down
```

To stop and remove all data (including the database volume):

```bash
docker-compose down -v
```

## Environment Configuration

The application uses the following environment variables that can be modified in the docker-compose.yml file:

### Backend
- `SPRING_PROFILES_ACTIVE`: Set to "prod" for production deployment
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

### Database
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 80 or 8080 are already in use, modify the port mappings in docker-compose.yml.

2. **Database connection issues**: Ensure the database container is running and the backend can connect to it.

3. **Frontend not loading**: Check the Nginx configuration and ensure the backend API proxy is correctly set up.

### Checking Container Status

```bash
docker-compose ps
```

## Backup and Restore

### Database Backup

```bash
docker exec -t tech-career-app_db_1 pg_dump -U postgres techcareerdb > backup.sql
```

### Database Restore

```bash
cat backup.sql | docker exec -i tech-career-app_db_1 psql -U postgres -d techcareerdb
```
