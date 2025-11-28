-- Employee Task Tracker Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS employee_task_tracker;
USE employee_task_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(255) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to VARCHAR(255),
  status ENUM('pending', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$YourHashedPasswordHere', 'admin'),
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'user')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO employees (name, email, department) VALUES 
('John Doe', 'john@example.com', 'Engineering'),
('Jane Smith', 'jane@example.com', 'Marketing')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO tasks (title, description, assigned_to, status) VALUES 
('Setup project', 'Initialize the project structure', 'John Doe', 'completed'),
('Create database', 'Design and create database schema', 'Jane Smith', 'pending')
ON DUPLICATE KEY UPDATE title = title;
