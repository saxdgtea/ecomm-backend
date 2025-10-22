const mongoose = require("mongoose");

/**
 * Product Schema
 * Core inventory item with category reference
 * Includes Cloudinary image URL
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Please provide a product image"],
      default: "https://via.placeholder.com/400", // Fallback image
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a category"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

/**
 * Index for faster queries on category
 */
productSchema.index({ category: 1 });

/**
 * Index for text search on name and description
 */
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
