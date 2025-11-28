# Employee Task Tracker

A comprehensive web application for managing employee tasks with role-based access control. Admins can manage tasks and employees, while regular users can view and update their assigned tasks.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Assumptions & Limitations](#assumptions--limitations)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors for JWT token management
- **Lucide React** - Icon library
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

### Database
- **MySQL 8.0+** - Relational database

## 🏗️ Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Pages: Dashboard, Tasks, Employees, Login, Register   │ │
│  │  Components: TaskCard, TaskForm, EmployeeForm, Navbar  │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS/REST API
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express Backend (Port 5000)                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Routes: Auth, Tasks, Employees, Dashboard              │ │
│  │  Middleware: Authentication, Role-based Authorization   │ │
│  │  Controllers: Business logic for each resource           │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ SQL
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│  Tables: users, tasks, employees                            │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

1. User registers/logs in
2. Backend generates JWT token with `{ id, role, name }`
3. Token stored in localStorage on client
4. Axios interceptor adds `Authorization: Bearer <token>` header
5. Backend validates token and extracts user info

### Role-Based Access Control (RBAC)

- **Admin Role**:
  - View all tasks and employees
  - Create, edit, delete tasks
  - Manage employees
  - Access dashboard with statistics
  - Filter tasks by status and employee

- **User Role**:
  - View only assigned tasks
  - Toggle task status (pending/completed)
  - Cannot create, edit, or delete tasks
  - Cannot access dashboard or employees page
  - Can only filter by status

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE employee_tracker;
```

2. Create database tables and load sample data:
   - Refer to [SAMPLE_DATA.md](./SAMPLE_DATA.md) for schema and sample data
   - Follow the setup instructions in that file to populate your database

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_tracker
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

4. Start backend server:
```bash
node server.js
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```
- **Response**: `{ token, user: { id, name, email, role } }`
- **Status**: 200 (Success), 400 (Validation Error)

#### Login User
- **POST** `/api/auth/login`
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: `{ token, user: { id, name, email, role } }`
- **Status**: 200 (Success), 400 (Invalid Credentials)

---

### Tasks

#### Get All Tasks
- **GET** `/api/tasks`
- **Authentication**: Required
- **Query Parameters**:
  - `status` (optional): "pending" or "completed"
  - `assigned_to` (optional): Employee name (Admin only)
- **Response**: Array of task objects
- **Behavior**:
  - **Admin**: Returns all tasks (filtered by query params)
  - **User**: Returns only tasks assigned to them (filtered by status)

#### Create Task (Admin only)
- **POST** `/api/tasks`
- **Authentication**: Required (Admin role)
- **Request Body**:
```json
{
  "title": "Fix login bug",
  "description": "Fix authentication issue on login page",
  "assigned_to": "John Doe",
  "status": "pending"
}
```
- **Response**: `{ message, id, task }`
- **Status**: 200 (Success), 400 (Validation Error), 403 (Unauthorized)

#### Update Task
- **PUT** `/api/tasks/:id`
- **Authentication**: Required
- **Request Body** (at least one field required):
```json
{
  "status": "completed",
  "title": "Updated title",
  "description": "Updated description",
  "assigned_to": "Jane Smith"
}
```
- **Behavior**:
  - **Any User**: Can update `status` field only
  - **Admin**: Can update `title`, `description`, `assigned_to`, and `status`
- **Response**: `{ message: "Task Updated Successfully" }`
- **Status**: 200 (Success), 400 (No fields to update), 403 (Unauthorized), 404 (Task not found)

#### Delete Task (Admin only)
- **DELETE** `/api/tasks/:id`
- **Authentication**: Required (Admin role)
- **Response**: `{ message: "Task Deleted Successfully" }`
- **Status**: 200 (Success), 403 (Unauthorized), 404 (Task not found)

---

### Employees

#### Get All Employees
- **GET** `/api/employees`
- **Authentication**: Required (Admin role)
- **Response**: Array of employee objects
- **Status**: 200 (Success), 403 (Unauthorized)

#### Create Employee (Admin only)
- **POST** `/api/employees`
- **Authentication**: Required (Admin role)
- **Request Body**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "position": "Senior Developer"
}
```
- **Response**: `{ message, id, employee }`
- **Status**: 200 (Success), 400 (Validation Error), 403 (Unauthorized)

#### Update Employee (Admin only)
- **PUT** `/api/employees/:id`
- **Authentication**: Required (Admin role)
- **Request Body**:
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "position": "Lead Developer"
}
```
- **Response**: `{ message: "Employee Updated Successfully" }`
- **Status**: 200 (Success), 400 (Validation Error), 403 (Unauthorized), 404 (Employee not found)

#### Delete Employee (Admin only)
- **DELETE** `/api/employees/:id`
- **Authentication**: Required (Admin role)
- **Response**: `{ message: "Employee Deleted Successfully" }`
- **Status**: 200 (Success), 403 (Unauthorized), 404 (Employee not found)

---

### Dashboard

#### Get Dashboard Statistics (Admin only)
- **GET** `/api/dashboard/stats`
- **Authentication**: Required (Admin role)
- **Response**:
```json
{
  "totalTasks": 10,
  "completedTasks": 6,
  "pendingTasks": 4,
  "totalEmployees": 5,
  "completionRate": 60
}
```
- **Status**: 200 (Success), 403 (Unauthorized)

---

## ✨ Features

### User Authentication
- Register new account
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Persistent login using localStorage

### Task Management
- Create tasks (Admin only)
- View tasks with role-based filtering
- Update task status (All users)
- Edit task details (Admin only)
- Delete tasks (Admin only)
- Filter tasks by status
- Filter tasks by assigned employee (Admin only)

### Employee Management
- Create employees (Admin only)
- View all employees (Admin only)
- Update employee details (Admin only)
- Delete employees (Admin only)

### Dashboard
- View task statistics (Admin only)
- Task completion rate
- Total tasks and employees count
- Pending vs completed tasks

### UI/UX
- Responsive design (mobile-friendly)
- Role-based UI rendering
- Loading states and error handling
- Toast notifications for actions
- Modal dialogs for forms
- Color-coded task status (pending: orange, completed: green)
- Interactive buttons with hover effects

## 📝 Assumptions & Limitations

### Assumptions

1. **Single Admin**: The system assumes at least one admin user exists for initial setup
2. **Email Uniqueness**: Email addresses are unique per user
3. **Task Assignment by Name**: Tasks are assigned to employees using their full name (not ID)
4. **JWT Expiration**: Tokens expire in 7 days; users must log in again after expiration
5. **Database Connection**: MySQL server is running and accessible at localhost:3306
6. **CORS**: Frontend and backend run on separate ports; CORS is not explicitly configured (assuming same domain in production)

### Limitations

1. **No Email Verification**: Registration doesn't require email verification
2. **No Password Reset**: Users cannot reset forgotten passwords
3. **No Real-time Updates**: Task updates don't use WebSockets; page refresh needed to see changes from other users
4. **Single Database Instance**: No replication or clustering support
5. **No File Uploads**: Cannot attach files to tasks or employee records
6. **No Task Comments**: No discussion/comment feature on tasks
7. **No Notifications**: No email or push notifications for task assignments
8. **No Audit Logging**: No history of who changed what and when
9. **No Advanced Search**: Search limited to status and employee filters only
10. **No Task Priority**: Tasks don't have priority levels
11. **No Recurring Tasks**: Cannot create recurring/recurring tasks
12. **No Task Dependencies**: Cannot set task dependencies or prerequisites
13. **No Bulk Operations**: Cannot bulk update or delete multiple tasks at once
14. **Limited Role Management**: Only two roles (Admin/User); no custom roles
15. **No Rate Limiting**: API endpoints are not rate-limited

### Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens used for stateless authentication
- Role-based access control prevents unauthorized operations
- SQL queries use parameterized statements to prevent SQL injection
- Consider enabling HTTPS in production
- Store JWT_SECRET securely (never commit to git)
- Implement rate limiting for production
- Add CORS configuration for production

## 🐛 Troubleshooting

### Backend Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL server is running
- Check database credentials in `.env` file
- Verify database exists

### Frontend Cannot Connect to Backend
```
Error: Failed to load resource: the server responded with a status of 404
```
- Ensure backend server is running on port 5000
- Check API endpoints in `frontend/src/services/api.js`
- Check browser console for CORS errors

### JWT Token Expired
```
Error: Invalid token
```
- Clear localStorage and log in again
- Token expires after 7 days

### Database Permission Denied
```
Error: ER_ACCESS_DENIED_FOR_USER
```
- Verify MySQL username and password in `.env`
- Ensure user has permissions on the database


