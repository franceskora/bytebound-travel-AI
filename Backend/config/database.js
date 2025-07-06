const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️  No MONGODB_URI found in env. Skipping MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("🔌 MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.warn("⚠️  Continuing server startup without DB.");
    // Don’t exit — just skip DB
  }
};

module.exports = connectDB;
