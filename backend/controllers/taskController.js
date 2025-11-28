const db = require("../config/db");

/**
 * GET TASKS
 * Admins see all tasks
 * Regular users see only tasks assigned to them
 * Supports filtering by status
 */
exports.getTasks = (req, res) => {
  const { status, assigned_to } = req.query;
  const userRole = req.user?.role;
  const userName = req.user?.name;

  console.log('getTasks called - User:', { role: userRole, name: userName }, 'Query:', { status, assigned_to });

  let sql = "SELECT * FROM tasks WHERE 1=1";
  const params = [];

  // If user is not admin, only show tasks assigned to them
  if (userRole !== 'admin') {
    sql += " AND assigned_to = ?";
    params.push(userName);
  } else if (assigned_to) {
    // If admin AND assigned_to filter is provided, filter by that employee
    sql += " AND assigned_to = ?";
    params.push(assigned_to);
  }

  // Apply status filter if provided
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC";

  console.log('SQL Query:', sql, 'Params:', params);

  // Execute query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ message: "Error fetching tasks", error: err.message });
    }
    console.log('Query result count:', result.length);
    res.json(result);
  });
};

/**
 * ADD TASK (Admin only)
 */
exports.addTask = (req, res) => {
  const { title, description, assigned_to, status } = req.body;

  console.log("ADD TASK REQUEST:", { title, description, assigned_to, status });

  // Validation
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const sql = `
    INSERT INTO tasks (title, description, assigned_to, status) 
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    title,
    description || "",
    assigned_to || null,
    status || "pending"
  ];

  console.log("SQL VALUES:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding task:", err);
      return res.status(400).json({ 
        message: "Error creating task", 
        error: err.message,
        details: err.sqlMessage || err.code
      });
    }

    res.json({ 
      message: "Task Added Successfully",
      id: result.insertId,
      task: {
        id: result.insertId,
        title,
        description,
        assigned_to: assigned_to || null,
        status: status || "pending"
      }
    });
  });
};

/**
 * UPDATE TASK
 * All users can update status
 * Only admins can update title, description, assigned_to
 */
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { status, title, description, assigned_to } = req.body;
  const userRole = req.user?.role;

  // Check if trying to update fields other than status
  const isUpdatingDetails = title || description || assigned_to;
  if (isUpdatingDetails && userRole !== 'admin') {
    return res.status(403).json({ message: "Only admins can update task details" });
  }

  // Build dynamic update query based on provided fields
  let sql = "UPDATE tasks SET ";
  const updates = [];
  const params = [];

  if (status) {
    updates.push("status = ?");
    params.push(status);
  }
  if (title) {
    updates.push("title = ?");
    params.push(title);
  }
  if (description) {
    updates.push("description = ?");
    params.push(description);
  }
  if (assigned_to) {
    updates.push("assigned_to = ?");
    params.push(assigned_to);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  sql += updates.join(", ") + " WHERE id = ?";
  params.push(taskId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ message: "Error updating task", error: err.message });
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task Updated Successfully" });
  });
};

/**
 * DELETE TASK (Admin only)
 */
exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ message: "Error deleting task", error: err.message });
    }

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task Deleted Successfully" });
  });
};
