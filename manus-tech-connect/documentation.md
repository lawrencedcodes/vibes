# Tech Connect Documentation

## Overview

Tech Connect is a web-based application that facilitates connecting people who teach technical topics with people who need to learn these resources. The platform allows users to sign up as either teachers or learners, specify their technology interests and availability, and get matched based on common availability and technology choices.

## Features

- **User Authentication**: Sign up, sign in, and profile management
- **Role-Based System**: Users can register as either teachers or learners
- **Profile Management**: Users can update their personal information and upload profile photos
- **Technology Selection**: Users can select technologies they want to teach or learn
- **Availability Scheduling**: Users can set their weekly availability for sessions
- **Matching Algorithm**: Learners can find teachers based on technology and availability
- **Connection Management**: Users can manage connection requests and accepted connections
- **Notification System**: Users receive notifications for connection requests, acceptances, and messages
- **Messaging Interface**: Connected users can communicate through a built-in messaging system
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: D1 Database (SQLite-compatible)
- **Authentication**: Custom authentication system with session management
- **Deployment**: Cloudflare Workers compatible

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd tech-connect
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Set up the database:
   ```
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   wrangler d1 execute DB --local --file=migrations/0002_notifications.sql
   wrangler d1 execute DB --local --file=migrations/0003_messages.sql
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Database Schema

The application uses the following database tables:

- **users**: Stores user information including role (teacher/learner)
- **technologies**: List of available technologies
- **user_technologies**: Junction table linking users to technologies
- **user_availability**: Stores user availability schedules
- **connections**: Records connections between teachers and learners
- **messages**: Stores messages between connected users
- **notifications**: Stores notifications for users

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `POST /api/auth/logout`: Log out a user

### Profile Management

- `GET /api/profile`: Get user profile information
- `PUT /api/profile`: Update user profile information
- `POST /api/profile/technologies`: Add or update user technologies
- `DELETE /api/profile/technologies`: Remove user technologies
- `POST /api/profile/availability`: Add or update user availability
- `DELETE /api/profile/availability`: Remove user availability

### Connections

- `GET /api/teachers`: Get list of teachers
- `POST /api/match`: Find a matching teacher
- `GET /api/connections`: Get user connections
- `POST /api/connections`: Create a new connection
- `PUT /api/connections`: Update connection status

### Messaging

- `GET /api/messages/[connectionId]`: Get messages for a connection
- `POST /api/messages/[connectionId]`: Send a message

### Notifications

- `GET /api/notifications`: Get user notifications
- `PUT /api/notifications`: Mark notification as read

## User Flows

### Teacher Flow

1. Register as a teacher
2. Complete profile with personal information and photo
3. Select technologies to teach and set proficiency levels
4. Set availability for teaching sessions
5. Receive connection requests from learners
6. Accept or reject connection requests
7. Message with connected learners

### Learner Flow

1. Register as a learner
2. Complete profile with personal information and photo
3. Select technologies to learn
4. Set availability for learning sessions
5. Find teachers manually or use the matching algorithm
6. Send connection requests to teachers
7. Message with connected teachers

## Deployment

### Local Deployment

Follow the installation steps above to run the application locally.

### Production Deployment

The application is designed to be deployed on Cloudflare Workers:

1. Configure your Cloudflare account and create a D1 database
2. Update the `wrangler.toml` file with your database details
3. Deploy using Wrangler:
   ```
   wrangler deploy
   ```

Alternatively, the application can be deployed to any platform that supports Next.js applications.

## Troubleshooting

### Common Issues

- **Database Connection Issues**: Ensure your database migrations have been applied correctly
- **Authentication Problems**: Clear browser cookies and try logging in again
- **Missing Profile Information**: Ensure all required profile fields are completed
- **Matching Algorithm Not Working**: Verify that both teachers and learners have set their availability and selected technologies

## Support

For any issues or questions, please contact Top Southern Coders at support@topsoutherncoders.com.

---

© 2025 Top Southern Coders. All rights reserved.
