const mongoose = require("mongoose");

/**
 * Category Schema
 * Organizes products into logical groups
 * Used for filtering and navigation
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a category description"],
    },
  },
  {
    timestamps: true,
    // Virtual populate to get products in this category
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual field to populate products belonging to this category
 * Not stored in DB, computed on query
 */
categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

module.exports = mongoose.model("Category", categorySchema);
