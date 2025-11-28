# Setup Instructions for Employee Task Tracker

## Prerequisites

- Node.js installed
- MySQL server running
- Environment variables configured

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_task_tracker
PORT=5000
JWT_SECRET=your_secret_key_here
```

**Replace with your actual MySQL credentials**

### 1.3 Initialize Database

Run the setup script to create database and tables:

```bash
npm run setup
```

This will:
- Create the database `employee_task_tracker`
- Create `users`, `employees`, and `tasks` tables
- Set up proper schema with timestamps

### 1.4 Start Backend Server

```bash
npm run dev
```

You should see:
```
MySQL Connected Successfully!
Server running on port 5000
```

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd frontend
npm install
```

### 2.2 Start Frontend Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Step 3: Test the Application

### 3.1 Create Account
1. Click "Sign up here" on the login page
2. Enter:
   - Full Name: `Your Name`
   - Email: `your@email.com`
   - Password: `password123`
3. Click "Create Account"

You should be redirected to the Tasks page.

### 3.2 Create Admin Account (Optional)

To test admin features, you can directly insert an admin user in MySQL:

```sql
USE employee_task_tracker;

INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$NjHZe3pIE7B3jtHZ0rB6uea0QgcbTT9mGr0H7FZuTt2QfNj0XvvvW', 'admin');
```

Then login with:
- Email: `admin@example.com`
- Password: `password`

## Database Schema

### Users Table
```sql
- id (Primary Key)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password (VARCHAR 255)
- role (ENUM: 'user', 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Employees Table
```sql
- id (Primary Key)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- department (VARCHAR 255)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tasks Table
```sql
- id (Primary Key)
- title (VARCHAR 255)
- description (TEXT)
- assigned_to (VARCHAR 255)
- status (ENUM: 'pending', 'completed')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

### Registration Not Working

**Error: "User already exists"**
- Clear the browser localStorage
- Check that email doesn't already exist in database
- Verify MySQL is running

**Error: "Database error"**
- Run `npm run setup` again to initialize database
- Check MySQL connection in `.env`

### Backend Connection Failed

- Verify MySQL is running
- Check `.env` credentials
- Ensure database name matches in `.env`

### Frontend Can't Connect to Backend

- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure backend is accessible at `http://localhost:5000`

## Features

### User (Regular)
- ✅ Register and Login
- ✅ View assigned tasks
- ✅ Update task status
- ✅ View all tasks

### Admin
- ✅ All user features
- ✅ View Dashboard with statistics
- ✅ Create new tasks
- ✅ Assign tasks to employees
- ✅ Update/Delete tasks
- ✅ Manage employees

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task (Admin only)
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Employees
- `GET /api/employees` - Get all employees (Admin only)
- `POST /api/employees` - Add employee (Admin only)

### Dashboard
- `GET /api/dashboard` - Get statistics (Admin only)

## Next Steps

1. Run database setup: `npm run setup`
2. Start backend: `npm run dev`
3. In new terminal, start frontend: `npm start`
4. Create account and test features
5. Check database for stored data: `SELECT * FROM users;`

## Support

For issues or questions, check:
- Backend console for server errors
- Browser console for frontend errors
- MySQL connection and database status
- `.env` file configuration
