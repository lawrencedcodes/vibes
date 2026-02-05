# Tech Pathways Database Schema

## Entity Relationship Diagram (Conceptual)

```
+----------------+       +-------------------+       +----------------+
|     Users      |       |    Assessments    |       |  CareerPaths   |
+----------------+       +-------------------+       +----------------+
| id             |<----->| id                |       | id             |
| username       |       | user_id           |       | title          |
| email          |       | completed         |       | description    |
| password_hash  |       | created_at        |       | salary_range   |
| first_name     |       | updated_at        |       | demand_level   |
| last_name      |       +-------------------+       | requirements   |
| created_at     |               |                   | growth_path    |
| updated_at     |               |                   +----------------+
+----------------+               |                           ^
        |                        |                           |
        |                        v                           |
        |              +-------------------+       +-------------------+
        |              | AssessmentAnswers |       | CareerRecommend.  |
        |              +-------------------+       +-------------------+
        |              | id                |       | id                |
        |              | assessment_id     |       | user_id           |
        |              | question_id       |       | career_path_id    |
        |              | answer_value      |       | match_percentage  |
        |              | created_at        |       | created_at        |
        |              +-------------------+       +-------------------+
        |                        ^                           |
        |                        |                           |
        v                        |                           v
+----------------+      +-------------------+       +-------------------+
| UserProfiles   |      |     Questions     |       |   LearningPlans   |
+----------------+      +-------------------+       +-------------------+
| id             |      | id                |       | id                |
| user_id        |      | category          |       | user_id           |
| learning_style |      | question_text     |       | career_path_id    |
| tech_access    |      | question_type     |       | title             |
| work_pref      |      | options           |       | description       |
| strengths      |      | weight_map        |       | created_at        |
| weaknesses     |      | created_at        |       | updated_at        |
| interests      |      +-------------------+       +-------------------+
| created_at     |                                          |
| updated_at     |                                          |
+----------------+                                          |
        ^                                                   v
        |                                         +-------------------+
        |                                         |   Milestones      |
        |                                         +-------------------+
        |                                         | id                |
        |                                         | learning_plan_id  |
        |                                         | title             |
        |                                         | description       |
        |                                         | due_date          |
        |                                         | completed         |
        |                                         | order_index       |
        |                                         | created_at        |
        |                                         +-------------------+
        |                                                  |
        |                                                  |
        |                                                  v
+----------------+      +-------------------+     +-------------------+
|   Resources    |      |   ForumTopics     |     |     Tasks         |
+----------------+      +-------------------+     +-------------------+
| id             |      | id                |     | id                |
| title          |      | title             |     | milestone_id      |
| description    |      | description       |     | title             |
| url            |      | user_id           |     | description       |
| type           |      | created_at        |     | resource_id       |
| cost           |      | updated_at        |     | completed         |
| learning_style |      +-------------------+     | order_index       |
| created_at     |               |                | created_at        |
+----------------+               |                +-------------------+
        ^                        v
        |              +-------------------+
        |              |   ForumPosts      |
        |              +-------------------+
        |              | id                |
        |              | topic_id          |
        |              | user_id           |
        |              | content           |
        |              | created_at        |
        |              | updated_at        |
        |              +-------------------+
        |
        |
+-------------------+     +-------------------+
| ResourceRecommend.|     |   SuccessStories  |
+-------------------+     +-------------------+
| id                |     | id                |
| user_id           |     | title             |
| resource_id       |     | content           |
| relevance_score   |     | author_name       |
| created_at        |     | author_background |
| updated_at        |     | career_path_id    |
+-------------------+     | created_at        |
                          +-------------------+
```

## Tables Description

### Users
- Stores user authentication and basic information
- Fields:
  - id (PK): Unique identifier
  - username: Unique username
  - email: User's email address
  - password_hash: Hashed password
  - first_name: User's first name
  - last_name: User's last name
  - created_at: Account creation timestamp
  - updated_at: Last update timestamp

### UserProfiles
- Stores detailed user profile information
- Fields:
  - id (PK): Unique identifier
  - user_id (FK): Reference to Users table
  - learning_style: User's preferred learning style
  - tech_access: Information about user's technological access
  - work_pref: Work environment preferences
  - strengths: User's strengths and skills
  - weaknesses: Areas for improvement
  - interests: Technology interests
  - created_at: Profile creation timestamp
  - updated_at: Last update timestamp

### Assessments
- Tracks user assessment sessions
- Fields:
  - id (PK): Unique identifier
  - user_id (FK): Reference to Users table
  - completed: Boolean indicating if assessment is complete
  - created_at: Assessment start timestamp
  - updated_at: Last update timestamp

### Questions
- Stores assessment questions
- Fields:
  - id (PK): Unique identifier
  - category: Question category (interests, skills, work style, etc.)
  - question_text: The actual question
  - question_type: Type of question (multiple choice, yes/no, etc.)
  - options: JSON array of possible answers
  - weight_map: JSON mapping of answers to career path weights
  - created_at: Question creation timestamp

### AssessmentAnswers
- Stores user responses to assessment questions
- Fields:
  - id (PK): Unique identifier
  - assessment_id (FK): Reference to Assessments table
  - question_id (FK): Reference to Questions table
  - answer_value: User's answer
  - created_at: Answer timestamp

### CareerPaths
- Stores information about different tech career paths
- Fields:
  - id (PK): Unique identifier
  - title: Career title
  - description: Detailed description of the career
  - salary_range: Typical salary range
  - demand_level: Market demand information
  - requirements: Required skills and qualifications
  - growth_path: Potential career progression
  - created_at: Creation timestamp

### CareerRecommendations
- Stores personalized career recommendations for users
- Fields:
  - id (PK): Unique identifier
  - user_id (FK): Reference to Users table
  - career_path_id (FK): Reference to CareerPaths table
  - match_percentage: Algorithm-calculated match score
  - created_at: Recommendation timestamp

### LearningPlans
- Stores personalized learning plans
- Fields:
  - id (PK): Unique identifier
  - user_id (FK): Reference to Users table
  - career_path_id (FK): Reference to CareerPaths table
  - title: Plan title
  - description: Plan description
  - created_at: Plan creation timestamp
  - updated_at: Last update timestamp

### Milestones
- Stores learning plan milestones
- Fields:
  - id (PK): Unique identifier
  - learning_plan_id (FK): Reference to LearningPlans table
  - title: Milestone title
  - description: Milestone description
  - due_date: Target completion date
  - completed: Boolean indicating completion status
  - order_index: Ordering within learning plan
  - created_at: Creation timestamp

### Tasks
- Stores specific tasks within milestones
- Fields:
  - id (PK): Unique identifier
  - milestone_id (FK): Reference to Milestones table
  - title: Task title
  - description: Task description
  - resource_id (FK): Optional reference to Resources table
  - completed: Boolean indicating completion status
  - order_index: Ordering within milestone
  - created_at: Creation timestamp

### Resources
- Stores learning resources
- Fields:
  - id (PK): Unique identifier
  - title: Resource title
  - description: Resource description
  - url: Resource URL
  - type: Resource type (course, tutorial, book, etc.)
  - cost: Cost information (free, paid, subscription)
  - learning_style: Learning style this resource suits
  - created_at: Creation timestamp

### ResourceRecommendations
- Stores personalized resource recommendations
- Fields:
  - id (PK): Unique identifier
  - user_id (FK): Reference to Users table
  - resource_id (FK): Reference to Resources table
  - relevance_score: Algorithm-calculated relevance score
  - created_at: Recommendation timestamp
  - updated_at: Last update timestamp

### ForumTopics
- Stores community forum topics
- Fields:
  - id (PK): Unique identifier
  - title: Topic title
  - description: Topic description
  - user_id (FK): Reference to Users table (creator)
  - created_at: Creation timestamp
  - updated_at: Last update timestamp

### ForumPosts
- Stores forum posts within topics
- Fields:
  - id (PK): Unique identifier
  - topic_id (FK): Reference to ForumTopics table
  - user_id (FK): Reference to Users table (author)
  - content: Post content
  - created_at: Creation timestamp
  - updated_at: Last update timestamp

### SuccessStories
- Stores success stories for inspiration
- Fields:
  - id (PK): Unique identifier
  - title: Story title
  - content: Story content
  - author_name: Name of the person in the story
  - author_background: Background information
  - career_path_id (FK): Reference to CareerPaths table
  - created_at: Creation timestamp
