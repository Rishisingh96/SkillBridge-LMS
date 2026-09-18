import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const demoUsers = [
  {
    name: "Demo Student",
    email: "student.demo@skillbridge.com",
    password: "Demo@123",
    role: "student",
  },
  {
    name: "Demo Educator",
    email: "educator.demo@skillbridge.com",
    password: "Demo@123",
    role: "educator",
  },
  {
    name: "Demo Admin",
    email: "admin.demo@skillbridge.com",
    password: "Demo@123",
    role: "admin",
  },
];

const createDemoUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const demoUser of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: demoUser.email });

      if (existingUser) {
        console.log(`User ${demoUser.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const hashPassword = await bcrypt.hash(demoUser.password, 10);

      // Create user
      await User.create({
        name: demoUser.name,
        email: demoUser.email,
        password: hashPassword,
        role: demoUser.role,
        isVerified: true,
      });

      console.log(`Created demo user: ${demoUser.email} (${demoUser.role})`);
    }

    console.log("\n✅ Demo users created successfully!");
    console.log("\nDemo Account Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Student:  student.demo@skillbridge.com  |  Password: Demo@123");
    console.log("Educator: educator.demo@skillbridge.com |  Password: Demo@123");
    console.log("Admin:    admin.demo@skillbridge.com    |  Password: Demo@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (error) {
    console.error("Error creating demo users:", error);
    process.exit(1);
  }
};

createDemoUsers();
