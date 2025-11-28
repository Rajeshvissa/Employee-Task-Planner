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

  // Check tasks table
  db.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tasks' AND TABLE_SCHEMA = ?",
    [process.env.DB_NAME],
    (err, columns) => {
      if (err) {
        console.error("❌ Error checking tasks table:", err.message);
        db.end();
        process.exit(1);
      }

      if (columns.length === 0) {
        console.error("❌ Tasks table doesn't exist!");
        console.log("\n📝 Run 'npm run setup' to create tables");
        db.end();
        process.exit(1);
      }

      console.log("✅ Tasks table exists with columns:");
      columns.forEach((col) => console.log(`   - ${col.COLUMN_NAME}`));
      
      db.end();
      process.exit(0);
    }
  );
});
