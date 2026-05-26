import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {

  const hashPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await User.create({
    name: "Rishi Singh",
    email: "rishi123@gmail.com",
    password: hashPassword,
    role: "admin",
    isVerified: true,
  });

  console.log(admin);

  process.exit();
};

createAdmin();