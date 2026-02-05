# API Documentation

This document provides detailed information about the Tech Pathways API endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:8080/api
```

## Authentication

Most API endpoints require authentication using JSON Web Tokens (JWT).

### How to Authenticate

1. Obtain a JWT token by calling the `/auth/signin` endpoint
2. Include the token in the Authorization header of subsequent requests:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: The request was successful
- `201 Created`: A resource was successfully created
- `400 Bad Request`: The request was malformed or invalid
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An unexpected error occurred on the server

Error responses include a JSON body with details:

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2025-03-28T14:10:21.000Z"
}
```

## Endpoints

### Authentication

#### Register a new user

```
POST /auth/signup
```

Request body:
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "message": "User registered successfully!"
}
```

#### Authenticate a user

```
POST /auth/signin
```

Request body:
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

Response:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### User Profile

#### Get current user profile

```
GET /users/profile
```

Response:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Aspiring tech professional",
    "learningPreferences": "Video Courses,Interactive Tutorials",
    "currentOccupation": "Marketing Specialist",
    "educationLevel": "Bachelor's Degree"
  }
}
```

#### Update user profile

```
PUT /users/profile
```

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Aspiring tech professional with a passion for web development",
  "learningPreferences": "Video Courses,Interactive Tutorials,Documentation",
  "currentOccupation": "Marketing Specialist",
  "educationLevel": "Bachelor's Degree"
}
```

Response:
```json
{
  "message": "Profile updated successfully"
}
```

### Assessment

#### Get assessment questions

```
GET /assessments/questions
```

Response:
```json
[
  {
    "id": 1,
    "questionId": "interest_1",
    "text": "Which of these activities do you enjoy the most?",
    "type": "SINGLE_CHOICE",
    "options": [
      "Designing user interfaces and visual elements",
      "Solving complex logical problems",
      "Analyzing data and finding patterns",
      "Building and fixing things",
      "Teaching or explaining concepts to others"
    ],
    "category": "Interest & Passion Exploration"
  },
  {
    "id": 2,
    "questionId": "skill_1",
    "text": "How would you rate your problem-solving abilities?",
    "type": "SINGLE_CHOICE",
    "options": [
      "Very strong - I enjoy complex problems",
      "Strong - I can usually find solutions",
      "Average - I can solve problems with some guidance",
      "Developing - I find problem-solving challenging",
      "Not sure"
    ],
    "category": "Skill & Strength Assessment"
  }
]
```

#### Submit assessment answers

```
POST /assessments/submit
```

Request body:
```json
{
  "title": "Career Assessment",
  "answers": [
    {
      "questionId": "interest_1",
      "answerValue": "Designing user interfaces and visual elements"
    },
    {
      "questionId": "skill_1",
      "answerValue": "Strong - I can usually find solutions"
    }
  ]
}
```

Response:
```json
{
  "id": 1,
  "title": "Career Assessment",
  "createdAt": "2025-03-28T14:10:21.000Z",
  "message": "Assessment submitted successfully"
}
```

#### Get user's assessment history

```
GET /assessments/history
```

Response:
```json
[
  {
    "id": 1,
    "title": "Career Assessment",
    "createdAt": "2025-03-28T14:10:21.000Z",
    "questionCount": 15,
    "hasRecommendations": true
  }
]
```

### Career Recommendations

#### Get career recommendations

```
GET /careers/recommendations
```

Response:
```json
[
  {
    "id": 1,
    "careerPath": {
      "id": 1,
      "title": "Frontend Developer",
      "description": "Frontend developers build user interfaces for websites and applications.",
      "requiredSkills": "HTML,CSS,JavaScript,React,UI/UX",
      "averageSalary": "$75,000 - $120,000",
      "jobGrowth": "High",
      "entryRequirements": "Portfolio of projects, knowledge of modern frameworks"
    },
    "matchPercentage": 92.5,
    "assessment": {
      "id": 1,
      "title": "Career Assessment"
    }
  },
  {
    "id": 2,
    "careerPath": {
      "id": 2,
      "title": "UX Designer",
      "description": "UX designers create user-friendly interfaces and experiences.",
      "requiredSkills": "UI Design,User Research,Wireframing,Prototyping,Figma",
      "averageSalary": "$70,000 - $110,000",
      "jobGrowth": "High",
      "entryRequirements": "Portfolio of designs, understanding of user psychology"
    },
    "matchPercentage": 85.0,
    "assessment": {
      "id": 1,
      "title": "Career Assessment"
    }
  }
]
```

#### Get detailed career information

```
GET /careers/{id}
```

Response:
```json
{
  "id": 1,
  "title": "Frontend Developer",
  "description": "Frontend developers build user interfaces for websites and applications.",
  "requiredSkills": "HTML,CSS,JavaScript,React,UI/UX",
  "averageSalary": "$75,000 - $120,000",
  "jobGrowth": "High",
  "entryRequirements": "Portfolio of projects, knowledge of modern frameworks",
  "dayToDay": "Writing code, collaborating with designers, testing and debugging",
  "careerPath": "Junior Developer → Mid-level Developer → Senior Developer → Lead Developer",
  "relatedRoles": "UI Developer, Web Designer, Full Stack Developer"
}
```

#### Generate new recommendations

```
POST /careers/recommendations/generate
```

Request body:
```json
{
  "assessmentId": 1
}
```

Response:
```json
[
  {
    "id": 1,
    "careerPath": {
      "id": 1,
      "title": "Frontend Developer",
      "description": "Frontend developers build user interfaces for websites and applications."
    },
    "matchPercentage": 92.5
  }
]
```

### Learning Plans

#### Create a new learning plan

```
POST /learning-plans/create
```

Request body:
```json
{
  "careerRecommendationId": 1
}
```

Response:
```json
{
  "id": 1,
  "title": "1-Year Frontend Developer Learning Path",
  "description": "A personalized learning plan to help you become a Frontend Developer within one year.",
  "careerPath": {
    "id": 1,
    "title": "Frontend Developer"
  },
  "message": "Learning plan created successfully"
}
```

#### Get user's learning plans

```
GET /learning-plans
```

Response:
```json
[
  {
    "id": 1,
    "title": "1-Year Frontend Developer Learning Path",
    "description": "A personalized learning plan to help you become a Frontend Developer within one year.",
    "careerPath": {
      "id": 1,
      "title": "Frontend Developer"
    },
    "startDate": "2025-03-28T00:00:00.000Z",
    "endDate": "2026-03-28T00:00:00.000Z",
    "progressPercentage": 25
  }
]
```

#### Get specific learning plan details

```
GET /learning-plans/{id}
```

Response:
```json
{
  "id": 1,
  "title": "1-Year Frontend Developer Learning Path",
  "description": "A personalized learning plan to help you become a Frontend Developer within one year.",
  "careerPath": {
    "id": 1,
    "title": "Frontend Developer",
    "description": "Frontend developers build user interfaces for websites and applications."
  },
  "startDate": "2025-03-28T00:00:00.000Z",
  "endDate": "2026-03-28T00:00:00.000Z",
  "progressPercentage": 25,
  "milestones": [
    {
      "id": 1,
      "title": "Technology Fundamentals",
      "description": "Learn the core concepts and tools needed for your tech career journey.",
      "dueDate": "2025-05-28T00:00:00.000Z",
      "completed": true,
      "orderIndex": 1,
      "tasks": [
        {
          "id": 1,
          "title": "Learn programming basics",
          "description": "Understand variables, data types, control structures, and functions.",
          "completed": true,
          "orderIndex": 1
        },
        {
          "id": 2,
          "title": "Set up your development environment",
          "description": "Install necessary software and tools for your learning journey.",
          "completed": true,
          "orderIndex": 2
        }
      ]
    }
  ],
  "resourceRecommendations": [
    {
      "id": 1,
      "resource": {
        "id": 1,
        "title": "Frontend Masters",
        "description": "Expert-led video courses on frontend development.",
        "url": "https://frontendmasters.com",
        "type": "Video Courses",
        "categories": "HTML,CSS,JavaScript,React"
      }
    }
  ]
}
```

#### Update task completion status

```
PUT /tasks/{id}/complete
```

Request body:
```json
{
  "completed": true
}
```

Response:
```json
{
  "message": "Task updated successfully"
}
```

### Resources

#### Get recommended resources

```
GET /resources/recommendations
```

Query parameters:
- `learningPlanId` (optional): Filter recommendations for a specific learning plan

Response:
```json
[
  {
    "id": 1,
    "resource": {
      "id": 1,
      "title": "Frontend Masters",
      "description": "Expert-led video courses on frontend development.",
      "url": "https://frontendmasters.com",
      "type": "Video Courses",
      "categories": "HTML,CSS,JavaScript,React",
      "rating": 4.8
    }
  },
  {
    "id": 2,
    "resource": {
      "id": 2,
      "title": "MDN Web Docs",
      "description": "Comprehensive documentation for web technologies.",
      "url": "https://developer.mozilla.org",
      "type": "Documentation",
      "categories": "HTML,CSS,JavaScript,Web APIs",
      "rating": 4.9
    }
  }
]
```

#### Get specific resource details

```
GET /resources/{id}
```

Response:
```json
{
  "id": 1,
  "title": "Frontend Masters",
  "description": "Expert-led video courses on frontend development.",
  "url": "https://frontendmasters.com",
  "type": "Video Courses",
  "categories": "HTML,CSS,JavaScript,React",
  "rating": 4.8,
  "cost": "Paid",
  "difficulty": "Beginner to Advanced",
  "format": "Video"
}
```

### Community

#### Get forum topics

```
GET /community/topics
```

Query parameters:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

Response:
```json
{
  "content": [
    {
      "id": 1,
      "title": "Tips for learning JavaScript",
      "description": "Share your best tips for learning JavaScript effectively",
      "author": {
        "id": 1,
        "username": "johndoe"
      },
      "createdAt": "2025-03-28T14:10:21.000Z",
      "postCount": 12
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "size": 10,
  "number": 0
}
```

#### Create a new forum topic

```
POST /community/topics
```

Request body:
```json
{
  "title": "Resources for learning React",
  "description": "What are the best resources for learning React in 2025?"
}
```

Response:
```json
{
  "id": 2,
  "title": "Resources for learning React",
  "description": "What are the best resources for learning React in 2025?",
  "author": {
    "id": 1,
    "username": "johndoe"
  },
  "createdAt": "2025-03-28T14:10:21.000Z"
}
```

#### Get posts for a topic

```
GET /community/topics/{id}/posts
```

Query parameters:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

Response:
```json
{
  "content": [
    {
      "id": 1,
      "content": "I found that breaking down concepts into small pieces and practicing daily works best for me.",
      "author": {
        "id": 1,
        "username": "johndoe"
      },
      "createdAt": "2025-03-28T14:10:21.000Z"
    }
  ],
  "totalElements": 12,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

#### Create a new post

```
POST /community/topics/{id}/posts
```

Request body:
```json
{
  "content": "I recommend the official React documentation and the React course on Frontend Masters."
}
```

Response:
```json
{
  "id": 2,
  "content": "I recommend the official React documentation and the React course on Frontend Masters.",
  "author": {
    "id": 1,
    "username": "johndoe"
  },
  "createdAt": "2025-03-28T14:10:21.000Z"
}
```

### Success Stories

#### Get success stories

```
GET /community/success-stories
```

Query parameters:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

Response:
```json
{
  "content": [
    {
      "id": 1,
      "title": "From Teacher to Frontend Developer in 10 months",
      "content": "I was a high school teacher for 5 years before deciding to transition into tech...",
      "author": {
        "id": 2,
        "username": "sarahjones"
      },
      "careerPath": {
        "id": 1,
        "title": "Frontend Developer"
      },
      "createdAt": "2025-03-28T14:10:21.000Z"
    }
  ],
  "totalElements": 8,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

#### Get specific success story

```
GET /community/success-stories/{id}
```

Response:
```json
{
  "id": 1,
  "title": "From Teacher to Frontend Developer in 10 months",
  "content": "I was a high school teacher for 5 years before deciding to transition into tech...",
  "author": {
    "id": 2,
    "username": "sarahjones"
  },
  "careerPath": {
    "id": 1,
    "title": "Frontend Developer"
  },
  "createdAt": "2025-03-28T14:10:21.000Z",
  "challenges": "The biggest challenge was learning to think programmatically...",
  "resources": "I found Frontend Masters and freeCodeCamp to be the most helpful resources...",
  "advice": "Don't be afraid to start building projects early, even if you don't feel ready..."
}
```
