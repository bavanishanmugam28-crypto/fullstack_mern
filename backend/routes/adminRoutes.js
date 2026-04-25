const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// 🟢 Path: http://localhost:5000/api/admin/orders
// Requires a valid JWT token AND admin role/email
router.get("/orders", protect, admin, adminController.getRecentOrders);

module.exports = router;
