import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // If not in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // find user
    const user = await User.findById(
      decoded.userId
    ).select("_id role isBanned currentSessionId sessionExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Account banned",
      });
    }

    // ✅ Session Validation - Check if session is still valid
    if (user.currentSessionId && user.sessionExpiresAt) {
      if (user.sessionExpiresAt < Date.now()) {
        // Session expired, clear it
        await User.findByIdAndUpdate(user._id, {
          currentSessionId: null,
          sessionDevice: null,
          sessionExpiresAt: null
        });
        
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again.",
          sessionExpired: true,
        });
      }
    }

    // ✅ attach full object
    req.user = {
      _id: user._id,
      role: user.role,
    };

    // ✅ attach userId for backward compatibility
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default isAuth;