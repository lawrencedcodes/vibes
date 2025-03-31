# Tech Career Guidance Web Application - Technical Documentation

## Architecture Overview

The Tech Career Guidance Web Application is built using a modern, scalable architecture with the following components:

1. **Frontend**: React with TypeScript and Material UI
2. **Backend**: Spring Boot REST API
3. **Database**: PostgreSQL (with H2 for development)
4. **Deployment**: Docker containerization

### System Architecture Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │◄────►│ Spring Boot API │◄────►│   PostgreSQL    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Frontend Architecture

### Technology Stack

- **React 18**: JavaScript library for building user interfaces
- **TypeScript**: Static typing for improved code quality
- **Material UI**: Component library for implementing dark mode design
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests

### Key Components

The frontend is organized into the following structure:

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── assessment/
│   │   ├── career/
│   │   ├── community/
│   │   ├── layout/
│   │   └── learning/
│   ├── pages/
│   ├── services/
│   ├── theme/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

### Responsive Design

The application follows a mobile-first approach with:
- Fluid layouts using CSS Grid and Flexbox
- Responsive breakpoints for different device sizes
- Touch-friendly UI elements
- Optimized performance for mobile devices

### Dark Mode Implementation

The dark mode theme is implemented using Material UI's ThemeProvider with:
- Custom color palette for dark mode
- Consistent typography and spacing
- Accessible contrast ratios
- System preference detection

## Backend Architecture

### Technology Stack

- **Spring Boot 3.0**: Java-based framework for building REST APIs
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access layer
- **PostgreSQL**: Production database
- **H2**: Development database
- **JWT**: Token-based authentication

### Key Components

The backend is organized into the following structure:

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── techcareer/
│   │   │           └── app/
│   │   │               ├── controller/
│   │   │               ├── model/
│   │   │               ├── repository/
│   │   │               ├── security/
│   │   │               ├── service/
│   │   │               └── TechCareerApplication.java
│   │   └── resources/
│   └── test/
└── pom.xml
```

### API Endpoints

The backend exposes the following main API endpoints:

#### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Authenticate a user and get JWT token

#### User Profile

- `GET /api/profile`: Get user profile
- `PUT /api/profile`: Update user profile
- `GET /api/profile/skills`: Get user skills
- `POST /api/profile/skills`: Add user skills

#### Assessment

- `POST /api/assessment/interests`: Submit interest assessment
- `POST /api/assessment/skills`: Submit skill assessment
- `POST /api/assessment/workstyle`: Submit work style preferences
- `POST /api/assessment/jobroles`: Submit job role interests
- `POST /api/assessment/techaccess`: Submit technological access

#### Career Recommendations

- `GET /api/career/recommendations`: Get career recommendations
- `GET /api/career/paths`: Get all career paths
- `GET /api/career/roles`: Get all job roles
- `GET /api/career/roles/{id}`: Get job role details

#### Learning Plans

- `GET /api/learning/plan`: Get user's learning plan
- `POST /api/learning/plan`: Generate new learning plan
- `PUT /api/learning/plan/milestone/{id}`: Update milestone status
- `GET /api/learning/resources`: Get learning resources

#### Community

- `GET /api/community/categories`: Get forum categories
- `GET /api/community/topics`: Get forum topics
- `POST /api/community/topics`: Create new topic
- `GET /api/community/qa-sessions`: Get expert Q&A sessions
- `GET /api/community/success-stories`: Get success stories

### Database Schema

The database schema includes the following main entities:

- **User**: User account information
- **UserProfile**: Detailed user profile data
- **Skill**: Technical and soft skills
- **UserSkill**: User's skill proficiency
- **CareerPath**: Career categories
- **JobRole**: Specific job positions
- **LearningResource**: Educational resources
- **LearningPlan**: User's personalized plan
- **LearningPlanMilestone**: Plan checkpoints
- **UserAssessment**: Assessment responses
- **AssessmentQuestion**: Assessment questions
- **CareerRecommendation**: Personalized recommendations
- **ForumCategory**: Community discussion categories
- **ForumTopic**: Discussion threads
- **ForumPost**: Individual messages
- **ExpertQASession**: Scheduled expert sessions
- **SuccessStory**: Career transition stories
- **PeerSupportConnection**: Mentorship connections

## Algorithms and Key Features

### Career Recommendation Algorithm

The career recommendation algorithm uses a weighted scoring system based on:

1. Interest alignment (40%)
2. Skill match (30%)
3. Work style compatibility (20%)
4. Technological access requirements (10%)

The algorithm calculates a match score for each job role and provides personalized explanations for why each role is recommended.

### Learning Plan Generator

The learning plan generator creates personalized 1-year plans with:

1. Phase-based structure (Foundation, Building, Specialization, Career Preparation)
2. Weekly and monthly milestones
3. Resource recommendations based on learning style
4. Adaptive difficulty based on current skill level
5. Time allocation based on user availability

## Security Implementation

### Authentication

- JWT-based authentication
- Password encryption with BCrypt
- Token expiration and refresh mechanism
- CORS configuration for secure API access

### Authorization

- Role-based access control (User, Admin)
- Method-level security with Spring Security
- Protected API endpoints

## Testing Strategy

### Backend Testing

- Unit tests for repositories, services, and controllers
- Integration tests for end-to-end flows
- Mock MVC for API testing

### Frontend Testing

- Component tests with React Testing Library
- Mock API responses for predictable testing
- Accessibility testing

## Deployment

The application is containerized using Docker with:

- Multi-container setup with Docker Compose
- Separate containers for frontend, backend, and database
- Nginx for serving frontend and proxying API requests
- Environment-specific configuration

## Performance Optimization

### Frontend Optimizations

- Code splitting for faster initial load
- Lazy loading of components
- Memoization for expensive calculations
- Image optimization

### Backend Optimizations

- Database indexing for faster queries
- Connection pooling
- Caching for frequently accessed data
- Pagination for large data sets

## Maintenance and Monitoring

### Logging

- Structured logging with SLF4J
- Different log levels for development and production
- Request/response logging for debugging

### Error Handling

- Global exception handling
- Consistent error responses
- Detailed error messages in development

## Future Enhancements

Potential areas for future development:

1. **AI-Enhanced Recommendations**: Implement machine learning for more accurate career matching
2. **Real-Time Collaboration**: Add WebSocket support for live community features
3. **Mobile Applications**: Develop native mobile apps for iOS and Android
4. **Content Management System**: Add admin interface for managing resources and content
5. **Analytics Dashboard**: Provide insights on user progress and platform usage
