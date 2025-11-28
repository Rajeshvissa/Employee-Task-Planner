# Sample Data for Employee Task Tracker

This file contains sample SQL data to populate the Employee Task Tracker database for testing and demonstration purposes.

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  position VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Sample Data

### Users

```sql
-- Insert sample users
INSERT INTO users (email, password, name, role) VALUES
('admin@example.com', '$2a$10$encrypted_password_admin', 'Admin User', 'admin'),
('john@example.com', '$2a$10$encrypted_password_john', 'John Doe', 'user'),
('alice@example.com', '$2a$10$encrypted_password_alice', 'Alice Johnson', 'user'),
('bob@example.com', '$2a$10$encrypted_password_bob', 'Bob Smith', 'user');

-- Note: Passwords are hashed with bcryptjs
-- Plain passwords for testing:
-- admin@example.com: password123
-- john@example.com: password123
-- alice@example.com: password123
-- bob@example.com: password123
```

### Employees

```sql
-- Insert sample employees
INSERT INTO employees (name, email, position) VALUES
('John Doe', 'john@example.com', 'Senior Developer'),
('Alice Johnson', 'alice@example.com', 'Product Manager'),
('Bob Smith', 'bob@example.com', 'UX Designer'),
('Sarah Williams', 'sarah@example.com', 'QA Engineer'),
('Mike Chen', 'mike@example.com', 'DevOps Engineer');
```

### Tasks

```sql
-- Insert sample tasks
INSERT INTO tasks (title, description, assigned_to, status) VALUES
('Fix login bug', 'Resolve authentication issue on login page', 'John Doe', 'pending'),
('Design dashboard', 'Create mockups for new dashboard layout', 'Alice Johnson', 'completed'),
('API documentation', 'Document all REST API endpoints', 'Bob Smith', 'pending'),
('Database optimization', 'Improve query performance on tasks table', 'John Doe', 'in-progress'),
('User testing', 'Conduct user testing sessions for new features', 'Alice Johnson', 'pending'),
('Mobile responsive', 'Make the app fully responsive for mobile devices', 'Sarah Williams', 'completed'),
('Performance testing', 'Run performance tests on API endpoints', 'Mike Chen', 'pending'),
('Bug fixes', 'Fix reported bugs from last release', 'Bob Smith', 'in-progress'),
('Feature brainstorm', 'Brainstorm ideas for next quarter features', 'Alice Johnson', 'pending'),
('Code review', 'Review pull requests from the team', 'John Doe', 'completed');
```

## Loading Sample Data

### Method 1: Using MySQL Command Line

1. Create the database:
```bash
mysql -u root -p -e "CREATE DATABASE employee_tracker;"
```

2. Create the schema:
```bash
mysql -u root -p employee_tracker < schema.sql
```

3. Load sample data:
```bash
mysql -u root -p employee_tracker < sample_data.sql
```

### Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create new query tab
4. Copy the schema SQL and execute
5. Copy the sample data SQL and execute

### Method 3: Using Node.js Script

Create a `seed-data.js` file in the backend directory:

```javascript
const db = require('./config/db');

const schema = `
  CREATE TABLE users (...)
  CREATE TABLE employees (...)
  CREATE TABLE tasks (...)
`;

const sampleData = `
  INSERT INTO users ...
  INSERT INTO employees ...
  INSERT INTO tasks ...
`;

db.query(schema, (err) => {
  if (err) console.error('Schema creation failed:', err);
  else console.log('Schema created successfully');
  
  db.query(sampleData, (err) => {
    if (err) console.error('Sample data insertion failed:', err);
    else console.log('Sample data inserted successfully');
    process.exit(0);
  });
});
```

Then run:
```bash
node seed-data.js
```

## Test Accounts

Use these credentials to test the application:

### Admin Account
- **Email**: admin@example.com
- **Password**: password123
- **Role**: Admin
- **Access**: Dashboard, Tasks, Employees, Analytics

### Regular User Accounts
- **Email**: john@example.com
- **Password**: password123
- **Name**: John Doe
- **Access**: Tasks (assigned), Status toggle

- **Email**: alice@example.com
- **Password**: password123
- **Name**: Alice Johnson
- **Access**: Tasks (assigned), Status toggle

- **Email**: bob@example.com
- **Password**: password123
- **Name**: Bob Smith
- **Access**: Tasks (assigned), Status toggle

## Sample Data Overview

### Tasks Distribution

- **Total Tasks**: 10
- **Pending**: 4
- **Completed**: 3
- **In Progress**: 2
- **Unassigned**: 1

### Employee Workload

- **John Doe**: 3 tasks (1 pending, 1 completed, 1 in progress)
- **Alice Johnson**: 3 tasks (2 pending, 1 completed)
- **Bob Smith**: 2 tasks (1 pending, 1 in progress)
- **Sarah Williams**: 1 task (completed)
- **Mike Chen**: 1 task (pending)

## Resetting Data

To reset the database and start fresh:

```sql
-- Drop tables (WARNING: This will delete all data)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- Then re-create schema and load sample data
```

Or use this Node.js command:

```bash
node -e "
const db = require('./config/db');
db.query('DROP TABLE IF EXISTS tasks; DROP TABLE IF EXISTS employees; DROP TABLE IF EXISTS users;', (err) => {
  if (err) console.error(err);
  else console.log('All tables dropped successfully');
  process.exit(0);
});
"
```

## Notes

- Sample passwords are plain text in documentation for testing only
- In production, never commit actual user credentials
- Modify the sample data to match your testing scenarios
- Ensure MySQL is running before loading data
- Use UTF-8 encoding for database compatibility

