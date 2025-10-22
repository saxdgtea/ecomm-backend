const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "./.env" });

/**
 * Configure Cloudinary with credentials from environment variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Configure Cloudinary storage for Multer
 * Images uploaded directly to Cloudinary
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-products", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Allowed image formats
    transformation: [{ width: 800, height: 800, crop: "limit" }], // Resize images
  },
});

/**
 * File filter to validate image uploads
 * Only allows image files
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/**
 * Multer upload middleware
 * Handles single image upload with field name 'image'
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = { upload, cloudinary };
