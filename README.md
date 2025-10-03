# User Management System - Frontend

React/Next.js frontend for the user management system with authentication.

## Features

- ✅ User registration and login
- ✅ JWT token authentication with Zustand store
- ✅ User management table with sorting by last login
- ✅ Bulk operations (block, unblock, delete users)
- ✅ Checkbox selection with select all/deselect all
- ✅ Bootstrap UI framework
- ✅ Responsive design
- ✅ Email verification flow
- ✅ Professional business-oriented design

## Tech Stack

- Next.js 15.5.4
- React 19.1.0
- TypeScript
- Bootstrap 5.3.0
- Axios for API calls
- Zustand for state management

## Prerequisites

- Node.js 18+
- Backend server running on port 3000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

## Build

Build for production:
```bash
npm run build
npm start
```

## Features Overview

### Authentication
- Login/Register forms with validation
- JWT token stored in Zustand store
- Automatic redirect on authentication status change
- Email verification flow

### User Management
- Table with user data sorted by last login time
- Checkbox selection (individual and select all)
- Toolbar with bulk operations:
  - Block users (button with text)
  - Unblock users (icon)
  - Delete users (icon)
  - Delete unverified users (icon)

### UI/UX
- Bootstrap-based responsive design
- Professional business appearance
- Toast notifications for success/error messages
- Loading states and proper error handling
- No animations or wallpapers as per requirements

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Main user management page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── verify/[id]/      # Email verification page
├── components/           # React components
│   ├── Navbar.tsx       # Navigation bar
│   ├── Toolbar.tsx      # Action toolbar
│   ├── UserTable.tsx    # User data table
│   └── BootstrapClient.tsx # Bootstrap JS initialization
├── services/            # API services
│   └── api.ts          # Axios configuration and API methods
└── store/              # Zustand stores
    ├── authStore.ts    # Authentication state
    └── userStore.ts    # User management state
```

## API Integration

The frontend communicates with the backend API using Axios:
- Authentication endpoints for login/register
- User management endpoints for CRUD operations
- Automatic token injection in requests
- Error handling with redirect to login on 401/403

## Security

- JWT tokens stored in memory (Zustand store)
- Automatic logout on token expiration
- Protected routes with authentication checks
- CSRF protection through proper API design
