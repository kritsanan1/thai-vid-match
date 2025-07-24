# LoveMatch Thailand - Dating App

## Project Overview
A modern dating application specifically designed for the Thai market, featuring user profiles, photo sharing, matching algorithms, real-time messaging, and swipe-based discovery. Successfully migrated from Lovable to Replit environment.

## Recent Changes
- **January 24, 2025**: Complete migration from Supabase to custom authentication system
- **January 24, 2025**: Database schema migrated to PostgreSQL with Drizzle ORM
- **January 24, 2025**: All frontend components updated to work with custom backend APIs
- **January 24, 2025**: Authentication system successfully tested and verified working

## Project Architecture

### Backend (Express.js + PostgreSQL)
- **Authentication**: Custom session-based auth with bcrypt password hashing
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **API Routes**: RESTful endpoints for auth, profiles, matching, and messaging
- **Session Management**: Express-session with secure cookie configuration

### Frontend (React + Vite)
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Shadcn/ui with Tailwind CSS styling
- **Authentication**: Custom auth context provider with React hooks

### Database Schema
- `users`: Core user authentication data
- `user_profiles`: Detailed profile information with photos and preferences
- `user_preferences`: Matching preferences and discovery settings  
- `matches`: User matches and compatibility data
- `messages`: Real-time messaging between matched users

## Key Features
- Thai language support throughout the interface
- Swipe-based user discovery interface
- Real-time messaging system
- Photo upload and profile management
- Advanced matching preferences
- Subscription tier support
- User verification system

## User Preferences
- Language: Thai primary, English secondary
- UI Style: Modern, romantic theme with gradient colors
- Authentication: Session-based (preferred over JWT for simplicity)

## Development Notes
- Uses session-based authentication instead of JWT tokens
- All Supabase dependencies have been completely removed
- Database migrations handled through Drizzle ORM
- Frontend components fully migrated to custom auth system
- Ready for further development and feature additions