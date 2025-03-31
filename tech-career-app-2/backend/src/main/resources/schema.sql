-- User Entity
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_completed BOOLEAN DEFAULT FALSE
);

-- User Profile Entity
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    current_occupation VARCHAR(100),
    years_of_experience INTEGER,
    education_level VARCHAR(50),
    location VARCHAR(100),
    technological_access TEXT,
    preferred_work_environment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Entity
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Skills (Many-to-Many)
CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) NOT NULL, -- Beginner, Intermediate, Advanced
    is_strength BOOLEAN DEFAULT FALSE,
    is_interest BOOLEAN DEFAULT FALSE,
    is_weakness BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- Career Paths Entity
CREATE TABLE career_paths (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    required_skills TEXT NOT NULL,
    average_salary_range VARCHAR(100),
    market_demand VARCHAR(50), -- High, Medium, Low
    growth_potential TEXT,
    entry_level_friendly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Roles Entity
CREATE TABLE job_roles (
    id SERIAL PRIMARY KEY,
    career_path_id INTEGER REFERENCES career_paths(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    required_skills TEXT NOT NULL,
    preferred_skills TEXT,
    average_salary_range VARCHAR(100),
    market_demand VARCHAR(50), -- High, Medium, Low
    entry_level_friendly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Career Interests (Many-to-Many)
CREATE TABLE user_career_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_path_id INTEGER NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    interest_level INTEGER NOT NULL, -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, career_path_id)
);

-- User Job Role Interests (Many-to-Many)
CREATE TABLE user_job_role_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_role_id INTEGER NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    interest_level INTEGER NOT NULL, -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_role_id)
);

-- Learning Resources Entity
CREATE TABLE learning_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- Course, Tutorial, Book, Video, etc.
    url VARCHAR(255),
    provider VARCHAR(100),
    cost_type VARCHAR(20) NOT NULL, -- Free, Paid, Freemium
    cost_amount DECIMAL(10, 2),
    difficulty_level VARCHAR(20) NOT NULL, -- Beginner, Intermediate, Advanced
    estimated_hours INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource Skills (Many-to-Many)
CREATE TABLE resource_skills (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, skill_id)
);

-- Resource Career Paths (Many-to-Many)
CREATE TABLE resource_career_paths (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    career_path_id INTEGER NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    relevance_level INTEGER NOT NULL, -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, career_path_id)
);

-- Learning Plans Entity
CREATE TABLE learning_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_job_role_id INTEGER REFERENCES job_roles(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, PAUSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Plan Milestones
CREATE TABLE learning_plan_milestones (
    id SERIAL PRIMARY KEY,
    learning_plan_id INTEGER NOT NULL REFERENCES learning_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED
    milestone_type VARCHAR(50) NOT NULL, -- LEARNING, PROJECT, NETWORKING, INTERVIEW_PREP, RESUME, PORTFOLIO
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Plan Resources (Many-to-Many)
CREATE TABLE learning_plan_resources (
    id SERIAL PRIMARY KEY,
    milestone_id INTEGER NOT NULL REFERENCES learning_plan_milestones(id) ON DELETE CASCADE,
    resource_id INTEGER NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(milestone_id, resource_id)
);

-- User Assessments
CREATE TABLE user_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) NOT NULL, -- INTEREST, SKILL, WORK_STYLE, TECH_ACCESS
    completed_at TIMESTAMP,
    results JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Questions
CREATE TABLE assessment_questions (
    id SERIAL PRIMARY KEY,
    assessment_type VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL, -- MULTIPLE_CHOICE, SCALE, TEXT
    options JSON,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Assessment Answers
CREATE TABLE user_assessment_answers (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, question_id)
);

-- Career Recommendations
CREATE TABLE career_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_role_id INTEGER NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    match_percentage INTEGER NOT NULL,
    reasoning TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_role_id)
);

-- Community Forum Categories
CREATE TABLE forum_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Forum Topics
CREATE TABLE forum_topics (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Forum Replies
CREATE TABLE forum_replies (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expert Q&A Sessions
CREATE TABLE qa_sessions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    expert_name VARCHAR(100) NOT NULL,
    expert_bio TEXT NOT NULL,
    session_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER,
    is_recorded BOOLEAN DEFAULT FALSE,
    recording_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Q&A Session Registrations
CREATE TABLE qa_session_registrations (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES qa_sessions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, user_id)
);

-- Success Stories
CREATE TABLE success_stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_image VARCHAR(255),
    previous_background TEXT NOT NULL,
    current_role VARCHAR(100) NOT NULL,
    transition_duration VARCHAR(50) NOT NULL,
    key_lessons TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentorship Profiles
CREATE TABLE mentorship_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_mentor BOOLEAN DEFAULT FALSE,
    is_mentee BOOLEAN DEFAULT FALSE,
    mentor_bio TEXT,
    mentor_expertise TEXT,
    mentee_goals TEXT,
    availability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Mentorship Relationships
CREATE TABLE mentorship_relationships (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES mentorship_profiles(id) ON DELETE CASCADE,
    mentee_id INTEGER NOT NULL REFERENCES mentorship_profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, ACTIVE, COMPLETED, DECLINED
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, mentee_id)
);

-- Portfolio Projects
CREATE TABLE portfolio_projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies_used TEXT NOT NULL,
    image_url VARCHAR(255),
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume Templates
CREATE TABLE resume_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    template_html TEXT NOT NULL,
    preview_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Resumes
CREATE TABLE user_resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES resume_templates(id),
    title VARCHAR(255) NOT NULL,
    content JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Preparation Resources
CREATE TABLE interview_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- QUESTION_BANK, MOCK_INTERVIEW, TIPS
    content TEXT NOT NULL,
    career_path_id INTEGER REFERENCES career_paths(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress Tracking
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_plan_id INTEGER REFERENCES learning_plans(id) ON DELETE CASCADE,
    milestone_id INTEGER REFERENCES learning_plan_milestones(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES learning_resources(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    achievement_type VARCHAR(50) NOT NULL, -- MILESTONE, SKILL, LEARNING, COMMUNITY
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
