import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuth = async (req, res, next) => {
  try {


    const { token } = req.cookies;

    if (!token) {
      // console.log("No token found in cookies");
      return res.status(401).json({ message: "Access denied. No token found" });
    }

    // console.log("Token found:", token.substring(0, 20) + "...");

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      // console.log("Token verification failed");
      return res.status(401).json({ message: "Invalid token" });
    }

    // console.log("Token verified successfully");
    // console.log("User ID from token:", verifyToken.userId);

    // ✅ Ek hi DB call — role bhi saath mein lo
    const user = await User.findById(verifyToken.userId).select("_id role isBanned");

    if (!user) {
      // console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        message: "Your account has been banned",
      });
    }

    // console.log("User found in database:", user._id);
    req.userId = user._id;
    req.userRole = user.role;  // ✅ role attach kiya



    next();
  } catch (error) {
    // console.log("isAuth error:", error);
    return res.status(500).json({ message: `isAuth error: ${error.message}` });
  }
};

export default isAuth;