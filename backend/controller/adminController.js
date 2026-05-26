import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

// ── Sab Users ──────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    console.log("=== GET ALL USERS API CALLED ===");
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    console.log("Users fetched:", users.length);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in getAllUsers:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Sirf Students ──────────────────────────────────
export const getAllStudents = async (req, res) => {
  try {
    console.log("=== GET ALL STUDENTS API CALLED ===");
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    console.log("Students fetched:", students.length);
    return res.status(200).json({ success: true, students });
  } catch (error) {
    console.log("Error in getAllStudents:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Sirf Educators ─────────────────────────────────
export const getAllEducators = async (req, res) => {
  try {
    console.log("=== GET ALL EDUCATORS API CALLED ===");
    const educators = await User.find({ role: "educator" })
      .select("-password")
      .populate("enrolledCourses", "title")
      .sort({ createdAt: -1 });

    console.log("Educators fetched:", educators.length);
    return res.status(200).json({ success: true, educators });
  } catch (error) {
    console.log("Error in getAllEducators:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Ban User ───────────────────────────────────────
export const banUser = async (req, res) => {
  try {
    console.log("=== BAN USER API CALLED ===");
    const { userId } = req.params;
    console.log("User ID to ban:", userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Admin ko ban nahi kar sakte
    if (user.role === "admin") {
      console.log("Cannot ban admin user");
      return res.status(403).json({ message: "Cannot ban admin" });
    }

    user.isBanned = true;
    await user.save();
    console.log("User banned successfully:", user.name);

    return res.status(200).json({ success: true, message: `${user.name} banned` });
  } catch (error) {
    console.log("Error in banUser:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Unban User ─────────────────────────────────────
export const unbanUser = async (req, res) => {
  try {
    console.log("=== UNBAN USER API CALLED ===");
    const { userId } = req.params;
    console.log("User ID to unban:", userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = false;
    await user.save();
    console.log("User unbanned successfully:", user.name);

    return res.status(200).json({ success: true, message: `${user.name} unbanned` });
  } catch (error) {
    console.log("Error in unbanUser:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Delete User ────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    console.log("=== DELETE USER API CALLED ===");
    const { userId } = req.params;
    console.log("User ID to delete:", userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      console.log("Cannot delete admin user");
      return res.status(403).json({ message: "Cannot delete admin" });
    }

    await User.findByIdAndDelete(userId);
    console.log("User deleted successfully:", user.name);

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("Error in deleteUser:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Role Change ────────────────────────────────────
export const changeUserRole = async (req, res) => {
  try {
    console.log("=== CHANGE USER ROLE API CALLED ===");
    const { userId } = req.params;
    const { role } = req.body;
    console.log("User ID:", userId, "New role:", role);

    if (!["student", "educator"].includes(role)) {
      console.log("Invalid role provided:", role);
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      console.log("Cannot change admin role");
      return res.status(403).json({ message: "Cannot change admin role" });
    }

    user.role = role;
    await user.save();
    console.log("Role changed successfully for user:", user.name);

    return res.status(200).json({
      success: true,
      message: `Role changed to ${role}`,
    });
  } catch (error) {
    console.log("Error in changeUserRole:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Sab Courses ────────────────────────────────────
export const getAllCourses = async (req, res) => {
  try {
    console.log("=== GET ALL COURSES API CALLED ===");
    const courses = await Course.find()
      .populate("creator", "name email role")
      .sort({ createdAt: -1 });

    console.log("Courses fetched:", courses.length);
    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.log("Error in getAllCourses:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Course Delete ──────────────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    console.log("=== DELETE COURSE API CALLED ===");
    const { courseId } = req.params;
    console.log("Course ID to delete:", courseId);

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    console.log("Course deleted successfully:", course.title);
    return res.status(200).json({ success: true, message: "Course deleted" });
  } catch (error) {
    console.log("Error in deleteCourse:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Course Publish Toggle ──────────────────────────
export const toggleCoursePublish = async (req, res) => {
  try {
    console.log("=== TOGGLE COURSE PUBLISH API CALLED ===");
    const { courseId } = req.params;
    console.log("Course ID:", courseId);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.isPublished = !course.isPublished;
    await course.save();
    console.log("Course publish status toggled:", course.isPublished);

    return res.status(200).json({
      success: true,
      message: course.isPublished ? "Course published" : "Course unpublished",
    });
  } catch (error) {
    console.log("Error in toggleCoursePublish:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── Platform Stats ─────────────────────────────────
export const getPlatformStats = async (req, res) => {
  try {
    console.log("=== GET PLATFORM STATS API CALLED ===");
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalEducators = await User.countDocuments({ role: "educator" });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    console.log("Platform stats:", { totalUsers, totalStudents, totalEducators, totalCourses, publishedCourses, bannedUsers });
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
    console.log("Error in getPlatformStats:", error);
    return res.status(500).json({ message: error.message });
  }
};