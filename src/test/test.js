const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config({ path: path.join(__dirname, "../../.env") });

// Debug env
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log(
  "API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing"
);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagePath = path.join(__dirname, "sample.jpg");

// 🧩 Check file exists
if (!fs.existsSync(imagePath)) {
  console.error("❌ sample.jpg not found at:", imagePath);
  process.exit(1);
}

async function testUpload() {
  try {
    console.log("☁️  Testing Cloudinary connection...");

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "ecommerce-products-test",
      resource_type: "image",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [{ width: 600, height: 600, crop: "limit" }],
    });

    console.log("✅ Upload successful!");
    console.log("🌍 URL:", result.secure_url);
    console.log("🆔 Public ID:", result.public_id);
  } catch (error) {
    console.error("❌ Cloudinary upload failed!");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
  }
}

testUpload();
