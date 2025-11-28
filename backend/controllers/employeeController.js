const db = require("../config/db");

exports.getEmployees = (req, res) => {
  const sql = "SELECT * FROM employees";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.status(500).json({ message: "Error fetching employees", error: err.message });
    }

    res.json(result);
  });
};

exports.addEmployee = (req, res) => {
  const { name, email, position } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const sql = "INSERT INTO employees (name, email, position) VALUES (?, ?, ?)";

  db.query(sql, [name, email, position || "General"], (err, result) => {
    if (err) {
      console.error("Error adding employee:", err);
      return res.status(400).json({ 
        message: err.code === 'ER_DUP_ENTRY' ? "Email already exists" : "Error creating employee",
        error: err.message 
      });
    }

    res.json({ 
      message: "Employee Added Successfully",
      id: result.insertId,
      employee: {
        id: result.insertId,
        name,
        email,
        position: position || "General"
      }
    });
  });
};
