import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// ── Get Current User ───────────────────────
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password -resetOtp -otpExpires -isOtpVerifed")
      .populate("enrolledCourses", "title thumbnail price category level");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `GetCurrentUser error: ${error.message}` });
  }
};

// ── Update Profile ─────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, phone, gender, dateOfBirth } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    // ✅ Photo upload
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      updateData.photoUrl = uploaded.fileUrl;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password -resetOtp -otpExpires -isOtpVerifed");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: `UpdateProfile error: ${error.message}` });
  }
};

// ── Change Password ────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Google auth user ke paas password nahi hota
    if (!user.password) {
      return res.status(400).json({ message: "Google account — password change not allowed" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `ChangePassword error: ${error.message}` });
  }
};

// ── Get Enrolled Courses ───────────────────
export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: "enrolledCourses",
        populate: {
          path: "creator",
          select: "name photoUrl",
        },
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      success: true,
      courses: user.enrolledCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: `GetEnrolledCourses error: ${error.message}` });
  }
};

// ── Delete Account ─────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `DeleteAccount error: ${error.message}` });
  }
};

// ── Get User by ID (Admin/Public) ──────────
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -resetOtp -otpExpires -isOtpVerifed")
      .populate("enrolledCourses", "title thumbnail");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: `GetUserById error: ${error.message}` });
  }
};