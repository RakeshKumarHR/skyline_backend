// resetAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed
const generateToken = require("./utils/generateToken"); // if you want to generate token

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skylinecinema";

async function resetAdmin() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // 2️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("Admin@123", salt);

    // 3️⃣ Update admin user
    const admin = await User.findOneAndUpdate(
      { email: "admin@example.com" },
      { password: hashed },
      { new: true }
    );

    if (!admin) {
      process.exit(1);
    }

    console.log("Admin password reset successfully");

    const token = generateToken(admin._id);
    console.log("Test token:", token);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

resetAdmin();
