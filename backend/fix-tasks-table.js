const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Connection Failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL!");

  // First drop the old table
  db.query("DROP TABLE IF EXISTS tasks", (err) => {
    if (err) {
      console.error("Error dropping tasks table:", err);
      process.exit(1);
    }
    console.log("✅ Old tasks table dropped");

    // Now create the new table
    const createTasks = `
      CREATE TABLE tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to VARCHAR(255),
        status ENUM('pending', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    db.query(createTasks, (err) => {
      if (err) {
        console.error("Error creating tasks table:", err);
        process.exit(1);
      }
      console.log("✅ Tasks table recreated with correct schema!");
      db.end();
      process.exit(0);
    });
  });
});
