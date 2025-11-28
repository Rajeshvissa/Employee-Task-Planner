const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'employee_tracker'
});

db.connect((err) => {
  if (err) {
    console.error("Connection Failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL!");

  // Admin credentials
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const adminName = "Admin User";

  // Hash password
  bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      process.exit(1);
    }

    // Check if admin already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail],
      (err, results) => {
        if (err) {
          console.error("Error checking admin:", err);
          process.exit(1);
        }

        if (results.length > 0) {
          console.log("❌ Admin user already exists!");
          console.log(`Email: ${adminEmail}`);
          console.log(`Password: ${adminPassword}`);
          db.end();
          process.exit(0);
        }

        // Insert admin user
        db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [adminName, adminEmail, hashedPassword, "admin"],
          (err) => {
            if (err) {
              console.error("Error inserting admin:", err);
              process.exit(1);
            }

            console.log("✅ Admin user created successfully!");
            console.log(`\n📧 Admin Credentials:`);
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: ${adminPassword}`);
            console.log(`\n🔐 Please change this password after first login!\n`);
            db.end();
            process.exit(0);
          }
        );
      }
    );
  });
});
