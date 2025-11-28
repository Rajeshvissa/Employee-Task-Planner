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

  /**
   * UPDATE EMPLOYEE (Admin only)
   */
  exports.updateEmployee = (req, res) => {
    const employeeId = req.params.id;
    console.log('updateEmployee called by user:', req.user, 'params:', req.params);
    const { name, email, position } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const sql = "UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?";
    const params = [name, email, position || 'General', employeeId];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error updating employee:', err);
        return res.status(500).json({ message: 'Error updating employee', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json({ message: 'Employee Updated Successfully' });
    });
  };

  /**
   * DELETE EMPLOYEE (Admin only)
   */
  exports.deleteEmployee = (req, res) => {
    const employeeId = req.params.id;
    console.log('deleteEmployee called by user:', req.user, 'params:', req.params);

    const sql = 'DELETE FROM employees WHERE id = ?';

    db.query(sql, [employeeId], (err, result) => {
      if (err) {
        console.error('Error deleting employee:', err);
        return res.status(500).json({ message: 'Error deleting employee', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json({ message: 'Employee Deleted Successfully' });
    });
  };

