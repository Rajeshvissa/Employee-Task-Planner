const express = require("express");
const { getEmployees, addEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only can add employees
router.post("/", authMiddleware, roleMiddleware("admin"), addEmployee);

// Admin only can view all employees
router.get("/", authMiddleware, roleMiddleware("admin"), getEmployees);

// Admin only update employee
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateEmployee);

// Admin only delete employee
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEmployee);

module.exports = router;
