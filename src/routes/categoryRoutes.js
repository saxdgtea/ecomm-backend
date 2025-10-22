const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * Category Routes
 */

// GET /api/categories - Get all categories (public)
// POST /api/categories - Create category (admin only)
router.route("/").get(getCategories).post(protect, adminOnly, createCategory);

// GET /api/categories/:id - Get single category (public)
// PUT /api/categories/:id - Update category (admin only)
// DELETE /api/categories/:id - Delete category (admin only)
router
  .route("/:id")
  .get(getCategory)
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
