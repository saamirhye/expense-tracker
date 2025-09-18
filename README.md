# Expense Tracker

A full-stack personal expense tracking application built with modern web technologies.

## Features

- User registration and authentication
- JWT-based session management
- Expense categorization and management
- RESTful API with comprehensive testing
- Responsive web interface

## Tech Stack

**Backend:**

- Node.js with Express.js
- TypeScript
- PostgreSQL with Prisma ORM
- JWT authentication
- Bcrypt password hashing
- Jest testing framework

**Frontend:**

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Git

### Installation

Clone the repository

```bash
git clone https://github.com/saamirhye/expense-tracker.git
cd expense-tracker
```

Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Database setup

```bash
npx prisma migrate dev
npx prisma db seed
```

Frontend setup

```bash
cd ../frontend
npm install
```

### Running the Application

Start the backend server

```bash
cd backend
npm run dev
```

Start the frontend development server

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser

### Testing

Run the backend test suite:

```bash
cd backend
npm test
```

Test coverage: 83%

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/expenses` - Get user expenses (authenticated)
- `POST /api/expenses` - Create new expense (authenticated)
