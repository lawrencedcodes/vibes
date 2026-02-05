# Developer Guide

This guide provides technical information for developers working on the Tech Pathways application.

## Project Structure

The Tech Pathways application follows a standard structure for a Spring Boot backend and React frontend:

```
TechPathways/
├── backend/                  # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/techpathways/api/
│   │   │   │   ├── controllers/    # REST API endpoints
│   │   │   │   ├── models/         # Entity classes
│   │   │   │   ├── repositories/   # Data access interfaces
│   │   │   │   ├── security/       # Authentication and authorization
│   │   │   │   ├── services/       # Business logic
│   │   │   │   └── payload/        # Request/response DTOs
│   │   │   └── resources/          # Configuration files
│   │   └── test/                   # Unit and integration tests
│   └── pom.xml                     # Maven configuration
├── frontend/                 # React frontend
│   ├── public/                     # Static files
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API service clients
│   │   ├── theme/                  # Theme configuration
│   │   ├── utils/                  # Utility functions
│   │   └── tests/                  # Frontend tests
│   └── package.json                # NPM configuration
└── docs/                     # Documentation
    ├── API_DOCUMENTATION.md        # API reference
    └── USER_GUIDE.md               # User instructions
```

## Backend Architecture

### Key Components

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement business logic and algorithms
3. **Repositories**: Interface with the database
4. **Models**: Define data structures and relationships
5. **Security**: Manage authentication and authorization

### Important Services

- **CareerRecommendationService**: Implements the algorithm for matching users with suitable tech careers based on assessment responses
- **LearningPlanService**: Generates personalized learning plans with milestones and tasks
- **ResourceRecommendationService**: Recommends learning resources based on user preferences and career path

### Database Schema

The application uses a PostgreSQL database with the following main entities:

- **users**: User authentication information
- **user_profiles**: Extended user information
- **assessments**: Career assessment metadata
- **questions**: Assessment questions
- **assessment_answers**: User responses to assessment questions
- **career_paths**: Information about tech career options
- **career_recommendations**: Matches between users and career paths
- **learning_plans**: Personalized learning roadmaps
- **milestones**: Major stages in learning plans
- **tasks**: Specific activities within milestones
- **resources**: Learning materials and tools
- **resource_recommendations**: Matches between users and resources
- **forum_topics**: Community discussion topics
- **forum_posts**: Individual messages in forum topics
- **success_stories**: User-submitted career transition stories

## Frontend Architecture

### Key Components

1. **Pages**: Full-page components corresponding to routes
2. **Components**: Reusable UI elements
3. **Services**: API client functions
4. **Theme**: Material-UI theme configuration
5. **Utils**: Helper functions and utilities

### State Management

The application uses React Context API for state management:

- **AuthContext**: Manages user authentication state
- **ThemeContext**: Manages dark/light mode preferences
- **NotificationContext**: Manages application notifications

### Routing

React Router is used for navigation with the following main routes:

- `/`: Home page
- `/login`: User login
- `/register`: User registration
- `/dashboard`: User dashboard
- `/assessment`: Career assessment
- `/careers`: Career recommendations
- `/learning-plan`: Learning plan
- `/resources`: Resource recommendations
- `/community`: Community forum
- `/profile`: User profile

## Development Workflow

### Setting Up the Development Environment

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   mvn install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
4. Set up the database:
   ```
   createdb techpathways
   ```
5. Configure application properties:
   ```
   # backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/techpathways
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### Running the Application Locally

1. Start the backend:
   ```
   cd backend
   mvn spring-boot:run
   ```
2. Start the frontend:
   ```
   cd frontend
   npm start
   ```
3. Access the application at http://localhost:3000

### Running Tests

1. Backend tests:
   ```
   cd backend
   mvn test
   ```
2. Frontend tests:
   ```
   cd frontend
   npm test
   ```

## Deployment

### Backend Deployment

The Spring Boot application can be deployed as a JAR file:

1. Build the JAR:
   ```
   cd backend
   mvn clean package
   ```
2. Run the JAR:
   ```
   java -jar target/techpathways-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment

The React application can be built for production:

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```
2. Serve the static files from a web server like Nginx or Apache

### Docker Deployment

The application includes Docker configuration for containerized deployment:

1. Build the Docker images:
   ```
   docker-compose build
   ```
2. Run the containers:
   ```
   docker-compose up -d
   ```

## Extending the Application

### Adding New Career Paths

1. Add the career path data to the database:
   ```sql
   INSERT INTO career_paths (title, description, required_skills, average_salary, job_growth, entry_requirements)
   VALUES ('New Career', 'Description', 'Skill1,Skill2,Skill3', '$70,000 - $100,000', 'High', 'Requirements');
   ```
2. Update the career recommendation algorithm in `CareerRecommendationService.java` to include attributes for the new career path

### Adding New Assessment Questions

1. Add the question data to the database:
   ```sql
   INSERT INTO questions (question_id, text, type, options, category)
   VALUES ('new_question_id', 'Question text?', 'SINGLE_CHOICE', 'Option1,Option2,Option3', 'Category');
   ```
2. Update the career recommendation algorithm to process the new question type if necessary

### Adding New Learning Resources

1. Add the resource data to the database:
   ```sql
   INSERT INTO resources (title, description, url, type, categories, rating)
   VALUES ('Resource Title', 'Description', 'https://example.com', 'Type', 'Category1,Category2', 4.5);
   ```

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Check database credentials in application.properties
   - Ensure PostgreSQL is running
   - Verify database name is correct

2. **JWT token issues**:
   - Check JWT secret key in application.properties
   - Verify token expiration time is appropriate

3. **CORS errors**:
   - Check CORS configuration in WebSecurityConfig.java
   - Ensure frontend URL is in the allowed origins list

4. **Build errors**:
   - Clear Maven cache: `mvn clean`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Logging

The application uses SLF4J with Logback for logging:

- Logs are written to `logs/application.log`
- Log level can be configured in `src/main/resources/logback.xml`
- In production, consider using a log aggregation service

## Performance Optimization

### Backend Optimization

1. **Database indexing**:
   - Indexes are defined on frequently queried columns
   - Consider adding additional indexes based on query patterns

2. **Caching**:
   - Spring Cache is configured for frequently accessed data
   - Consider using Redis for distributed caching in production

3. **Connection pooling**:
   - HikariCP is configured for optimal database connection management
   - Adjust pool size based on server resources

### Frontend Optimization

1. **Code splitting**:
   - React.lazy and Suspense are used for route-based code splitting
   - Consider additional splitting for large components

2. **Image optimization**:
   - Use WebP format for images where possible
   - Implement lazy loading for images

3. **Bundle optimization**:
   - Tree shaking is enabled in production builds
   - Consider using a CDN for static assets

## Security Considerations

1. **Authentication**:
   - JWT tokens are used for stateless authentication
   - Tokens expire after 24 hours
   - Refresh tokens are implemented for seamless user experience

2. **Authorization**:
   - Role-based access control is implemented
   - API endpoints are secured with appropriate permissions

3. **Data protection**:
   - Passwords are hashed using BCrypt
   - Sensitive data is encrypted in the database
   - HTTPS is required for all communications

4. **Input validation**:
   - All user inputs are validated on both client and server
   - Prepared statements are used for database queries to prevent SQL injection
   - XSS protection is implemented through proper output encoding
