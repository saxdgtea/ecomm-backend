const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

/**
 * Auth Routes
 */

// POST /api/auth/register - Register new user
router.post("/register", registerUser);

// POST /api/auth/login - Login user
router.post("/login", loginUser);

// GET /api/auth/me - Get current user (protected)
router.get("/me", protect, getMe);

module.exports = router;
