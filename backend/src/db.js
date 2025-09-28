import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/smartpto";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected to:", mongoUri);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
