"use client";

import { createHash } from 'crypto';

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  role: 'teacher' | 'learner';
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  userId: number;
  email: string;
  role: 'teacher' | 'learner';
  firstName: string;
  lastName: string;
}

// Constants
const SESSION_COOKIE_NAME = 'tech_connect_session';
const SESSION_EXPIRY_DAYS = 7;

// Hash password
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Verify password - client-side mock implementation
export async function verifyPassword(
  db: any,
  email: string,
  password: string
): Promise<User | null> {
  // In a real implementation, this would verify against the database
  // For this demo, we'll return a mock user
  const mockUser: User = {
    id: 1,
    email: email,
    first_name: 'Demo',
    last_name: 'User',
    photo_url: null,
    role: 'learner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return mockUser;
}

// Create session - client-side mock implementation
export function createSession(user: User): string {
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    role: user.role as 'teacher' | 'learner',
    firstName: user.first_name,
    lastName: user.last_name,
  };
  
  // In a real implementation, we would set a cookie
  // For this demo, we'll just return the session token
  const sessionToken = Buffer.from(JSON.stringify(session)).toString('base64');
  
  return sessionToken;
}

// Get current session - client-side implementation
export function getSession(): AuthSession | null {
  // In a real implementation, we would read from cookies
  // For this demo, we'll return a mock session
  const mockSession: AuthSession = {
    userId: 1,
    email: 'user@example.com',
    role: 'learner',
    firstName: 'Demo',
    lastName: 'User'
  };
  
  return mockSession;
}

// Clear session - client-side mock implementation
export function clearSession(): void {
  // In a real implementation, we would clear the cookie
  console.log('Session cleared');
}

// Register new user - client-side mock implementation
export async function registerUser(
  db: any,
  userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'teacher' | 'learner';
    photo_url?: string;
  }
): Promise<User | null> {
  // In a real implementation, this would register a user in the database
  // For this demo, we'll return a mock user
  const mockUser: User = {
    id: 1,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    photo_url: userData.photo_url || null,
    role: userData.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return mockUser;
}

// Get user by ID - client-side mock implementation
export async function getUserById(
  db: any,
  userId: number
): Promise<User | null> {
  // In a real implementation, this would fetch a user from the database
  // For this demo, we'll return a mock user
  const mockUser: User = {
    id: userId,
    email: 'user@example.com',
    first_name: 'Demo',
    last_name: 'User',
    photo_url: null,
    role: 'learner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return mockUser;
}
