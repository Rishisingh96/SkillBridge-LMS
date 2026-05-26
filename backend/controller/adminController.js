import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

// ── Sab Users ──────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Sirf Students ──────────────────────────────────
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Sirf Educators ─────────────────────────────────
export const getAllEducators = async (req, res) => {
  try {
    const educators = await User.find({ role: "educator" })
      .select("-password")
      .populate("enrolledCourses", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, educators });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Ban User ───────────────────────────────────────
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Admin ko ban nahi kar sakte
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot ban admin" });
    }

    user.isBanned = true;
    await user.save();

    return res.status(200).json({ success: true, message: `${user.name} banned` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Unban User ─────────────────────────────────────
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = false;
    await user.save();

    return res.status(200).json({ success: true, message: `${user.name} unbanned` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Delete User ────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin" });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Role Change ────────────────────────────────────
export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["student", "educator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot change admin role" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Role changed to ${role}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Sab Courses ────────────────────────────────────
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("creator", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Course Delete ──────────────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.status(200).json({ success: true, message: "Course deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Course Publish Toggle ──────────────────────────
export const toggleCoursePublish = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.isPublished = !course.isPublished;
    await course.save();

    return res.status(200).json({
      success: true,
      message: course.isPublished ? "Course published" : "Course unpublished",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── Platform Stats ─────────────────────────────────
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalEducators = await User.countDocuments({ role: "educator" });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalEducators,
        totalCourses,
        publishedCourses,
        bannedUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};