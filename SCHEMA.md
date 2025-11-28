# Database Schema & Migration Script

This file contains the complete database schema and migration scripts for the Employee Task Tracker application.

## Database Creation

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS employee_tracker;
USE employee_tracker;
```

## Tables Schema

### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' COMMENT 'admin or user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts with authentication info';
```

**Columns**:
- `id` - Primary key, auto-increment
- `email` - Unique email address for login
- `password` - Hashed password (bcryptjs)
- `name` - User display name
- `role` - User role (admin or user)
- `created_at` - Account creation timestamp
- `updated_at` - Last account update timestamp

### Employees Table

```sql
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  position VARCHAR(255) COMMENT 'Job position/title',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_email (email),
  INDEX idx_position (position),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Employee directory';
```

**Columns**:
- `id` - Primary key, auto-increment
- `name` - Full name of employee
- `email` - Email address
- `position` - Job title/position
- `created_at` - Record creation timestamp
- `updated_at` - Last record update timestamp

### Tasks Table

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  assigned_to VARCHAR(255) COMMENT 'Employee name (references employees.name)',
  status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending or completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_status_assigned (status, assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Task management and tracking';
```

**Columns**:
- `id` - Primary key, auto-increment
- `title` - Task title/name
- `description` - Detailed task description
- `assigned_to` - Name of employee assigned to task
- `status` - Task status (pending/completed)
- `created_at` - Task creation timestamp
- `updated_at` - Last task update timestamp

## Complete Schema Script

Save this as `schema.sql` and run with:
```bash
mysql -u root -p employee_tracker < schema.sql
```

```sql
-- =====================================================
-- Employee Task Tracker Database Schema
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS employee_tracker;
USE employee_tracker;

-- =====================================================
-- USERS TABLE
-- =====================================================
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' COMMENT 'admin or user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts with authentication info';

-- =====================================================
-- EMPLOYEES TABLE
-- =====================================================
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  position VARCHAR(255) COMMENT 'Job position/title',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_email (email),
  INDEX idx_position (position),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Employee directory';

-- =====================================================
-- TASKS TABLE
-- =====================================================
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  assigned_to VARCHAR(255) COMMENT 'Employee name (references employees.name)',
  status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending or completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_status_assigned (status, assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Task management and tracking';

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for common queries
ALTER TABLE users ADD INDEX idx_email_role (email, role);
ALTER TABLE tasks ADD INDEX idx_status_created (status, created_at);

-- =====================================================
-- VIEWS (Optional)
-- =====================================================

-- View: Task Summary
CREATE OR REPLACE VIEW vw_task_summary AS
SELECT 
  t.id,
  t.title,
  t.description,
  t.assigned_to,
  t.status,
  t.created_at,
  t.updated_at,
  e.email as employee_email,
  e.position as employee_position
FROM tasks t
LEFT JOIN employees e ON t.assigned_to = e.name;

-- View: Task Statistics
CREATE OR REPLACE VIEW vw_task_statistics AS
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
  ROUND((SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as completion_rate
FROM tasks;

-- View: Employee Task Count
CREATE OR REPLACE VIEW vw_employee_tasks AS
SELECT 
  e.id,
  e.name,
  e.email,
  e.position,
  COUNT(t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
FROM employees e
LEFT JOIN tasks t ON e.name = t.assigned_to
GROUP BY e.id, e.name, e.email, e.position;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
```

## Migration Scripts

### Migration 1: Initial Setup (v1.0.0)

**File**: `migrations/001_initial_schema.sql`

```sql
-- Migration: Initial Database Schema
-- Version: 1.0.0
-- Date: 2025-01-01

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  position VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  assigned_to VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
```

### Migration 2: Add Indexes (v1.1.0)

**File**: `migrations/002_add_indexes.sql`

```sql
-- Migration: Add Performance Indexes
-- Version: 1.1.0
-- Date: 2025-02-15

ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE users ADD INDEX idx_role (role);
ALTER TABLE users ADD INDEX idx_email_role (email, role);

ALTER TABLE employees ADD INDEX idx_name (name);
ALTER TABLE employees ADD INDEX idx_email (email);
ALTER TABLE employees ADD INDEX idx_position (position);

ALTER TABLE tasks ADD INDEX idx_assigned_to (assigned_to);
ALTER TABLE tasks ADD INDEX idx_status (status);
ALTER TABLE tasks ADD INDEX idx_status_assigned (status, assigned_to);
ALTER TABLE tasks ADD INDEX idx_created_at (created_at);
```

### Migration 3: Add Views (v1.2.0)

**File**: `migrations/003_add_views.sql`

```sql
-- Migration: Add Database Views
-- Version: 1.2.0
-- Date: 2025-03-01

CREATE OR REPLACE VIEW vw_task_summary AS
SELECT 
  t.id,
  t.title,
  t.description,
  t.assigned_to,
  t.status,
  t.created_at,
  t.updated_at,
  e.email as employee_email,
  e.position as employee_position
FROM tasks t
LEFT JOIN employees e ON t.assigned_to = e.name;

CREATE OR REPLACE VIEW vw_task_statistics AS
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
  ROUND((SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as completion_rate
FROM tasks;

CREATE OR REPLACE VIEW vw_employee_tasks AS
SELECT 
  e.id,
  e.name,
  e.email,
  e.position,
  COUNT(t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
FROM employees e
LEFT JOIN tasks t ON e.name = t.assigned_to
GROUP BY e.id, e.name, e.email, e.position;
```

## Running Migrations

### Automated Migration with Node.js

Create `backend/migrate.js`:

```javascript
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const migrationsDir = path.join(__dirname, 'migrations');

// Get all migration files
const files = fs.readdirSync(migrationsDir).sort();

console.log('Starting database migrations...\n');

let completed = 0;
let failed = 0;

files.forEach((file, index) => {
  const filepath = path.join(migrationsDir, file);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  console.log(`Running migration ${index + 1}/${files.length}: ${file}`);
  
  db.query(sql, (err) => {
    if (err) {
      console.error(`❌ Migration failed: ${file}`);
      console.error(err);
      failed++;
    } else {
      console.log(`✅ Migration completed: ${file}`);
      completed++;
    }
    
    if (completed + failed === files.length) {
      console.log(`\nMigration Summary:`);
      console.log(`✅ Completed: ${completed}`);
      console.log(`❌ Failed: ${failed}`);
      process.exit(failed > 0 ? 1 : 0);
    }
  });
});
```

Run migrations:
```bash
node migrate.js
```

### Manual Migration with MySQL

```bash
# Run complete schema
mysql -u root -p employee_tracker < backend/database/schema.sql

# Or run individual migrations
mysql -u root -p employee_tracker < backend/migrations/001_initial_schema.sql
mysql -u root -p employee_tracker < backend/migrations/002_add_indexes.sql
mysql -u root -p employee_tracker < backend/migrations/003_add_views.sql
```

## Useful Queries

### View Database Statistics

```sql
-- Check table sizes
SELECT 
  TABLE_NAME,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'employee_tracker'
ORDER BY (data_length + index_length) DESC;
```

### Check Task Completion Rate

```sql
SELECT * FROM vw_task_statistics;
```

### View Employee Workload

```sql
SELECT * FROM vw_employee_tasks
ORDER BY total_tasks DESC;
```

### Export Data

```bash
# Backup entire database
mysqldump -u root -p employee_tracker > backup.sql

# Restore from backup
mysql -u root -p employee_tracker < backup.sql
```

## Schema Versioning

Current schema version: **1.2.0**

| Version | Migration | Changes |
|---------|-----------|---------|
| 1.0.0 | 001_initial_schema.sql | Created users, employees, tasks tables |
| 1.1.0 | 002_add_indexes.sql | Added performance indexes |
| 1.2.0 | 003_add_views.sql | Added database views for analytics |

## Database Best Practices

1. **Indexes**: Indexed columns used frequently in WHERE, JOIN, and ORDER BY clauses
2. **Charset**: UTF-8mb4 for full Unicode support
3. **Collation**: utf8mb4_unicode_ci for case-insensitive searches
4. **Timestamps**: Automatic creation and update timestamps
5. **Views**: Pre-defined views for common queries
6. **Comments**: Column and table comments for documentation

## Performance Optimization

- Composite indexes on frequently joined columns
- Separate index for status and assigned_to (used together in filtering)
- Proper data types to minimize storage
- LONGTEXT for descriptions to handle variable content

## Backup & Recovery

### Regular Backups

```bash
# Daily backup
mysqldump -u root -p employee_tracker > backup_$(date +%Y%m%d).sql

# Compress backup
mysqldump -u root -p employee_tracker | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Point-in-Time Recovery

Requires binary logging enabled in MySQL configuration (`/etc/mysql/my.cnf`):
```ini
[mysqld]
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 10
```

---

**Last Updated**: November 28, 2025
**Database Version**: 1.2.0
**Compatibility**: MySQL 8.0+
