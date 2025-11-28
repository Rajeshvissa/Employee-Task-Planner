const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

db.connect((err) => {
  if (err) {
    console.error("Connection Failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL!");

  // Create database
  const dbName = process.env.DB_NAME || 'employee_tracker';
  db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      process.exit(1);
    }
    console.log("✓ Database created/exists");

    // Select database
    const dbName = process.env.DB_NAME || 'employee_tracker';
    db.changeUser({ database: dbName }, (err) => {
      if (err) {
        console.error("Error selecting database:", err);
        process.exit(1);
      }
      console.log("✓ Database selected");

      // Create tables
      const createTables = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS employees (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          department VARCHAR(255) DEFAULT 'General',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          assigned_to VARCHAR(255),
          status ENUM('pending', 'completed') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;

      db.query(createTables, (err) => {
        if (err) {
          console.error("Error creating tables:", err);
          process.exit(1);
        }
        console.log("✓ Tables created/exist");
        console.log("\n✅ Database setup completed successfully!");
        process.exit(0);
      });
    });
  });
});
