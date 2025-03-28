# Tech Pathways

Tech Pathways is a comprehensive web application designed to provide clear, actionable pathways into technology careers for individuals with diverse backgrounds. The application features personalized career recommendations, structured learning plans, and community support to help users navigate their journey into tech.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features

- **User Authentication**: Secure registration and login system
- **Career Assessment**: Interactive questionnaires to identify interests, skills, and preferences
- **Career Recommendation Algorithm**: Personalized tech career recommendations based on assessment results
- **Learning Plan Generator**: Structured 1-year learning plans with weekly/monthly milestones
- **Progress Tracking**: Tools to track learning progress and celebrate milestones
- **Resource Recommendations**: Personalized learning resource suggestions
- **Community Forum**: Platform for users to connect, share experiences, and ask questions
- **Success Stories**: Showcase of real-life stories of individuals who have successfully transitioned into tech careers

### Additional Features

- **Portfolio Building Guidance**: Resources and templates for building a compelling portfolio
- **Networking Strategies**: Advice on networking with industry professionals
- **Interview Preparation**: Resources and practice questions for technical and behavioral interviews
- **Resume/CV Building**: Templates and advice for creating effective resumes/CVs tailored to tech roles

## Technology Stack

### Backend

- **Framework**: Spring Boot 2.7.x
- **Language**: Java 11
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT authentication
- **Build Tool**: Maven

### Frontend

- **Framework**: React 18.x with TypeScript
- **UI Library**: Material-UI (MUI) 5.x
- **State Management**: React Context API
- **Routing**: React Router 6.x
- **HTTP Client**: Axios

## Architecture

The application follows a modern, scalable architecture:

### Backend Architecture

- **Controller Layer**: REST API endpoints for client communication
- **Service Layer**: Business logic and algorithm implementation
- **Repository Layer**: Data access and persistence
- **Model Layer**: Entity definitions and data transfer objects
- **Security Layer**: Authentication and authorization

### Frontend Architecture

- **Component-Based Structure**: Reusable UI components
- **Container/Presentation Pattern**: Separation of data fetching and presentation
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Modern, clean dark theme throughout the application

### Database Schema

The database schema includes the following main entities:

- **Users**: User authentication and profile information
- **Assessments**: Career assessment questionnaires and responses
- **Career Paths**: Information about various tech career options
- **Learning Plans**: Personalized learning roadmaps
- **Resources**: Learning materials and recommendations
- **Community**: Forum topics and posts

## Installation

### Prerequisites

- Java 11 or higher
- Node.js 14 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tech-pathways.git
   cd tech-pathways
   ```

2. Configure the database:
   ```
   # Create a PostgreSQL database
   createdb techpathways
   
   # Update application.properties with your database credentials
   # src/main/resources/application.properties
   ```

3. Build and run the backend:
   ```
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   The backend server will start on http://localhost:8080

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Configure the API endpoint:
   ```
   # Create .env file if it doesn't exist
   echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
   ```

3. Start the development server:
   ```
   npm start
   ```
   The frontend application will be available at http://localhost:3000

## Usage

### User Registration and Login

1. Navigate to the application homepage
2. Click "Sign Up" to create a new account
3. Fill in your details and submit the registration form
4. Log in with your credentials

### Career Assessment

1. From the dashboard, click "Take Assessment"
2. Answer all questions in the assessment
3. Submit your responses to receive career recommendations

### Exploring Career Recommendations

1. View your personalized career recommendations
2. Click on a career to see detailed information
3. Create a learning plan for your chosen career path

### Following Your Learning Plan

1. Access your learning plan from the dashboard
2. Complete tasks and mark them as finished
3. Track your progress through milestones
4. Access recommended resources for each stage of your learning

### Community Interaction

1. Browse forum topics or create new ones
2. Participate in discussions
3. Share your experiences and ask questions
4. Read success stories for inspiration

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Authenticate a user and receive JWT token

### User Endpoints

- `GET /api/users/profile`: Get current user profile
- `PUT /api/users/profile`: Update user profile

### Assessment Endpoints

- `GET /api/assessments/questions`: Get assessment questions
- `POST /api/assessments/submit`: Submit assessment answers
- `GET /api/assessments/history`: Get user's assessment history

### Career Endpoints

- `GET /api/careers/recommendations`: Get career recommendations
- `GET /api/careers/{id}`: Get detailed career information
- `POST /api/careers/recommendations/generate`: Generate new recommendations

### Learning Plan Endpoints

- `POST /api/learning-plans/create`: Create a new learning plan
- `GET /api/learning-plans`: Get user's learning plans
- `GET /api/learning-plans/{id}`: Get specific learning plan details
- `PUT /api/learning-plans/{id}/progress`: Update learning plan progress

### Resource Endpoints

- `GET /api/resources/recommendations`: Get recommended resources
- `GET /api/resources/{id}`: Get specific resource details

### Community Endpoints

- `GET /api/community/topics`: Get forum topics
- `POST /api/community/topics`: Create a new forum topic
- `GET /api/community/topics/{id}/posts`: Get posts for a topic
- `POST /api/community/topics/{id}/posts`: Create a new post

## Contributing

We welcome contributions to the Tech Pathways project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
