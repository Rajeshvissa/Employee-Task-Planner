const express = require("express");
const { getEmployees, addEmployee } = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only can add employees
router.post("/", authMiddleware, roleMiddleware("admin"), addEmployee);

// Admin only can view all employees
router.get("/", authMiddleware, roleMiddleware("admin"), getEmployees);

module.exports = router;
