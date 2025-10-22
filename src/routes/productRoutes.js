const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

/**
 * Product Routes
 */

// GET /api/products - Get all products (public)
// POST /api/products - Create product with image upload (admin only)
router
  .route("/")
  .get(getProducts)
  .post(protect, adminOnly, upload.single("image"), createProduct);

// GET /api/products/:id - Get single product (public)
// PUT /api/products/:id - Update product with optional image (admin only)
// DELETE /api/products/:id - Delete product (admin only)
router
  .route("/:id")
  .get(getProduct)
  .put(protect, adminOnly, upload.single("image"), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
