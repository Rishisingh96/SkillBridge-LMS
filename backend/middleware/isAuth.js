import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ Ek hi DB call — role bhi saath mein lo
    const user = await User.findById(verifyToken.userId).select("_id role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userId = user._id;
    req.userRole = user.role;  // ✅ role attach kiya

    next();
  } catch (error) {
    return res.status(500).json({ message: `isAuth error: ${error.message}` });
  }
};

export default isAuth;