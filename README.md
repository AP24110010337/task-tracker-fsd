# Task & Time Tracking System

A simple MERN application for managing tasks, tracking time spent on them, and viewing progress in a dashboard.

## Features

- User signup and login with JWT authentication
- Create and update tasks
- Start and stop timers for tasks
- Track task status as `Pending`, `In Progress`, or `Completed`
- View dashboard summaries for total tasks, completed tasks, in-progress tasks, and total tracked time

## Tech Stack

- Frontend: React.js, TailwindCSS, Axios
- Backend: Node.js, Express.js, JWT, Bcrypt
- Database: MongoDB, Mongoose

## Project Structure

```text
task-tracker-fsd/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |   |-- AppLayout.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |   |-- PublicRoute.jsx
|   |   |   |-- StatCard.jsx
|   |   |   |-- TaskCard.jsx
|   |   |   \-- TaskForm.jsx
|   |   |-- context/
|   |   |   \-- AuthContext.jsx
|   |   |-- pages/
|   |   |   |-- DashboardPage.jsx
|   |   |   |-- LoginPage.jsx
|   |   |   |-- SignupPage.jsx
|   |   |   \-- TasksPage.jsx
|   |   |-- services/
|   |   |   \-- api.js
|   |   |-- utils/
|   |   |   \-- format.js
|   |   |-- App.jsx
|   |   |-- index.css
|   |   \-- main.jsx
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   \-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |   \-- db.js
|   |   |-- controllers/
|   |   |   |-- authController.js
|   |   |   |-- dashboardController.js
|   |   |   \-- taskController.js
|   |   |-- middleware/
|   |   |   |-- authMiddleware.js
|   |   |   \-- errorMiddleware.js
|   |   |-- models/
|   |   |   |-- Task.js
|   |   |   |-- TimeLog.js
|   |   |   \-- User.js
|   |   |-- routes/
|   |   |   |-- authRoutes.js
|   |   |   |-- dashboardRoutes.js
|   |   |   \-- taskRoutes.js
|   |   |-- utils/
|   |   |   \-- generateToken.js
|   |   |-- app.js
|   |   \-- server.js
|   \-- package.json
\-- README.md
```

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` 

Start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and calls the backend API on `http://localhost:5000/api`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `POST /api/tasks/:id/start`
- `POST /api/tasks/:id/stop`
- `GET /api/dashboard`

## Important Logic

- One user can run only one active timer at a time.
- When a timer starts on a `Pending` task, the task status changes to `In Progress`.
- Time log duration is stored in seconds.
