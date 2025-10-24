const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} - Signed JWT token
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields (name, email, password) are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  try {
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role:
        role && ["admin", "manager", "customer"].includes(role)
          ? role
          : "customer",
    });

    if (!user) {
      res.status(400);
      throw new Error("User creation failed. Please try again.");
    }

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("User registration error details:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Unexpected server error during registration",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});
/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/**
 * @desc Get logged-in user info
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
