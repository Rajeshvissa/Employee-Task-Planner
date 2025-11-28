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

  // Add name column if it doesn't exist
  const alterTableSQL = `
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT 'User'
  `;

  db.query(alterTableSQL, (err) => {
    if (err) {
      console.error("❌ Error adding column:", err.message);
      process.exit(1);
    }
    console.log("✅ Name column added/exists");

    // Verify the fix
    db.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = ?",
      [process.env.DB_NAME],
      (err, columns) => {
        if (err) {
          console.error("Error checking columns:", err.message);
        } else {
          console.log("\n✅ Users table columns:");
          columns.forEach((col) => console.log(`   - ${col.COLUMN_NAME}`));
        }
        console.log("\n✅ Database is ready! You can now register users.");
        db.end();
      }
    );
  });
});
