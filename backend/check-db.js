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
    console.error("❌ Connection Failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL!");

  // Check if users table exists
  db.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = ?",
    [process.env.DB_NAME],
    (err, columns) => {
      if (err) {
        console.error("❌ Error checking table:", err.message);
        db.end();
        process.exit(1);
      }

      if (columns.length === 0) {
        console.error("❌ Users table doesn't exist!");
        console.log("\n📝 Run 'npm run setup' to create tables");
        db.end();
        process.exit(1);
      }

      console.log("✅ Users table exists with columns:");
      columns.forEach((col) => console.log(`   - ${col.COLUMN_NAME}`));

      // Check if name column exists
      const hasNameColumn = columns.some((col) => col.COLUMN_NAME === "name");
      if (!hasNameColumn) {
        console.error("❌ 'name' column is missing!");
        console.log("\n⚠️  Run this SQL to add the column:");
        console.log(
          "ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT 'User';"
        );
        db.end();
        process.exit(1);
      }

      console.log("\n✅ Database structure is correct!");

      // Show sample data
      db.query("SELECT id, name, email, role FROM users LIMIT 5", (err, rows) => {
        if (err) {
          console.error("Error reading users:", err.message);
        } else {
          console.log("\n📊 Sample users:");
          if (rows.length === 0) {
            console.log("   No users yet");
          } else {
            console.table(rows);
          }
        }
        db.end();
      });
    }
  );
});
