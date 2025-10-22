const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getMyOrders,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * Order Routes
 */

// GET /api/orders - Get all orders (admin only)
// POST /api/orders - Create new order (authenticated users)
router.route("/").get(protect, adminOnly, getOrders).post(protect, createOrder);

// GET /api/orders/my-orders - Get current user's orders
router.get("/my-orders", protect, getMyOrders);

// GET /api/orders/:id - Get single order (owner or admin)
// PUT /api/orders/:id - Update order status (admin only)
router
  .route("/:id")
  .get(protect, getOrder)
  .put(protect, adminOnly, updateOrderStatus);

module.exports = router;
