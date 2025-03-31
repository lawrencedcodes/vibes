#!/bin/bash

# Build script for Tech Career Guidance Web Application

echo "Building Tech Career Guidance Web Application..."

# Build the frontend
echo "Building React frontend..."
cd /home/ubuntu/tech-career-app/frontend
npm run build

# Build the backend
echo "Building Spring Boot backend..."
cd /home/ubuntu/tech-career-app/backend
./mvnw clean package -DskipTests

echo "Build completed successfully!"
