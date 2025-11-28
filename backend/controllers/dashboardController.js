const db = require("../config/db");

// DASHBOARD STATS (Admin Only)
exports.getDashboardStats = (req, res) => {
  const stats = {};

  // Query all stats in one go
  const query = `
    SELECT 
      COUNT(*) as totalTasks,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedTasks,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingTasks
    FROM tasks
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching dashboard stats:", err);
      return res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
    }

    const row = result[0];
    stats.totalTasks = row.totalTasks || 0;
    stats.completedTasks = row.completedTasks || 0;
    stats.pendingTasks = row.pendingTasks || 0;
    
    // Calculate completion rate
    stats.completionRate = stats.totalTasks > 0 
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
      : 0;

    // Get total employees
    const employeeQuery = "SELECT COUNT(*) as total FROM employees";
    db.query(employeeQuery, (err, empResult) => {
      if (err) {
        console.error("Error fetching employee count:", err);
        stats.totalEmployees = 0;
      } else {
        stats.totalEmployees = empResult[0].total || 0;
      }

      res.json(stats);
    });
  });
};
