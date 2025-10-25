const mongoose = require("mongoose");

/**
 * Order Schema
 * Represents customer purchases
 * Links user to products with quantities
 * Enhanced with customer delivery info
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow guest orders
    },
    // Customer Info (for guest orders via WhatsApp)
    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      notes: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        // Store price at time of order (in case product price changes later)
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderSource: {
      type: String,
      enum: ["website", "whatsapp", "admin"],
      default: "website",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for faster queries on user and status
 */
orderSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);
