const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, hashedPassword, role || "user"], (err, result) => {
    if (err) {
      console.error("Registration error:", err.message || err);
      console.error("Error code:", err.code);
      return res.status(400).json({ 
        message: err.code === 'ER_DUP_ENTRY' ? "Email already exists" : "Database error: " + err.message 
      });
    }

    const userId = result.insertId;
    const token = generateToken(userId, role || "user", name);

    res.json({
      message: "User Registered Successfully",
      token,
      user: {
        id: userId,
        name,
        email,
        role: role || "user"
      }
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err || result.length === 0)
      return res.status(400).json({ message: "Invalid Credentials" });

    const user = result[0];

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = generateToken(user.id, user.role, user.name);

    res.json({
      message: "Login Success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};
