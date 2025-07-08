// connectDB.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("⚠️  Skipping MongoDB — no MONGODB_URI provided");
    return;  // No crash — just skip
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,  // faster failure
    });
    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Don't exit—just warn
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("🔌 MongoDB disconnected");
  });
  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed through app termination");
    process.exit(0);
  });
};

module.exports = connectDB;
