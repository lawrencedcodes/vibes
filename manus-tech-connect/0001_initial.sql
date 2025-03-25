-- Tech Connect Database Schema
-- Created: March 9, 2025

-- Drop tables if they exist to ensure clean setup
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS user_availability;
DROP TABLE IF EXISTS user_technologies;
DROP TABLE IF EXISTS technologies;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    photo_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'learner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create technologies table
CREATE TABLE technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_technologies junction table
CREATE TABLE user_technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    technology_id INTEGER NOT NULL,
    proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
    UNIQUE(user_id, technology_id)
);

-- Create user_availability table
CREATE TABLE user_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create connections table
CREATE TABLE connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    learner_id INTEGER NOT NULL,
    technology_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connection_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default technologies
INSERT INTO technologies (name, description) VALUES 
('JavaScript', 'A programming language that is one of the core technologies of the World Wide Web'),
('TypeScript', 'A strongly typed programming language that builds on JavaScript'),
('Java', 'A high-level, class-based, object-oriented programming language'),
('C#', 'A general-purpose, multi-paradigm programming language'),
('Python', 'An interpreted, high-level, general-purpose programming language'),
('Data Structures and Algorithms', 'Fundamental computer science concepts'),
('Tech Career Preparation', 'Resume building, interview preparation, and career guidance');

-- Create indexes for performance
CREATE INDEX idx_user_technologies_user_id ON user_technologies(user_id);
CREATE INDEX idx_user_technologies_technology_id ON user_technologies(technology_id);
CREATE INDEX idx_user_availability_user_id ON user_availability(user_id);
CREATE INDEX idx_connections_teacher_id ON connections(teacher_id);
CREATE INDEX idx_connections_learner_id ON connections(learner_id);
CREATE INDEX idx_connections_technology_id ON connections(technology_id);
CREATE INDEX idx_messages_connection_id ON messages(connection_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
