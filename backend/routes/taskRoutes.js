const express = require("express");
const { getTasks, addTask, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Add task → Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), addTask);

// View tasks → All authenticated users
router.get("/", authMiddleware, getTasks);

// Update task → All authenticated users can update status; only admins can update details
router.put("/:id", authMiddleware, updateTask);

// Delete task → Admin only
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTask);

module.exports = router;
