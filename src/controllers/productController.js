const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { cloudinary } = require("../middleware/uploadMiddleware");

/**
 * @desc    Get all products with optional filtering
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;

  // Build query object
  let query = {};

  // Filter by category if provided
  if (category) {
    query.category = category;
  }

  // Text search on name and description
  if (search) {
    query.$text = { $search: search };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create new product with image upload
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  // Validation
  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Get image URL from uploaded file (multer/cloudinary)
  let imageUrl = "https://via.placeholder.com/400";

  if (req.file) {
    imageUrl = req.file.path; // Cloudinary URL
  }

  const product = await Product.create({
    name,
    description,
    price,
    image: imageUrl,
    category,
    stock: stock || 0,
  });

  // Populate category details
  await product.populate("category", "name");

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // If new image uploaded, delete old image from Cloudinary and use new one
  if (req.file) {
    // Extract public_id from old image URL to delete it
    if (product.image && product.image.includes("cloudinary")) {
      const publicId = product.image
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
    }

    req.body.image = req.file.path; // New Cloudinary URL
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("category", "name");

  res.json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Delete image from Cloudinary if exists
  if (product.image && product.image.includes("cloudinary")) {
    const publicId = product.image.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
