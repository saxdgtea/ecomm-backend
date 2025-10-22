const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB database
 * Uses connection string from environment variables
 * Handles connection errors and success logging
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB 👍 Umbwa 🐶 wewe");
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
