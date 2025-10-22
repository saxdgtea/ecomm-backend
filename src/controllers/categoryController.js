const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Product = require("../models/Product");

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

/**
 * @desc    Get single category with its products
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate({
    path: "products",
    select: "name price image stock",
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Validation
  if (!name || !description) {
    res.status(400);
    throw new Error("Please provide name and description");
  }

  // Check if category already exists
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Check if category has products
  const productsCount = await Product.countDocuments({
    category: req.params.id,
  });

  if (productsCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete category. It has ${productsCount} product(s). Please delete or reassign products first.`
    );
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
