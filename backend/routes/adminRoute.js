import express from "express";
import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";
import {
  // Users
  getAllUsers,
  getAllStudents,
  getAllEducators,
  banUser,
  unbanUser,
  deleteUser,
  changeUserRole,

  // Courses
  getAllCourses,
  deleteCourse,
  toggleCoursePublish,

  // Stats
  getPlatformStats,
} from "../controller/adminController.js";

const adminRouter = express.Router();

// ── User Management ────────────────────────────────
adminRouter.get("/users", isAuth, isRole("admin"), getAllUsers);           // Sab users
adminRouter.get("/students", isAuth, isRole("admin"), getAllStudents);     // Sirf students
adminRouter.get("/educators", isAuth, isRole("admin"), getAllEducators);   // Sirf educators
adminRouter.put("/ban/:userId", isAuth, isRole("admin"), banUser);         // Ban karo
adminRouter.put("/unban/:userId", isAuth, isRole("admin"), unbanUser);     // Unban karo
adminRouter.delete("/user/:userId", isAuth, isRole("admin"), deleteUser);  // Delete karo
adminRouter.put("/role/:userId", isAuth, isRole("admin"), changeUserRole); // Role change karo

// ── Course Management ──────────────────────────────
adminRouter.get("/courses", isAuth, isRole("admin"), getAllCourses);                    // Sab courses
adminRouter.delete("/course/:courseId", isAuth, isRole("admin"), deleteCourse);        // Course delete
adminRouter.put("/course/publish/:courseId", isAuth, isRole("admin"), toggleCoursePublish); // Publish toggle

// ── Platform Stats ─────────────────────────────────
adminRouter.get("/stats", isAuth, isRole("admin"), getPlatformStats);     // Platform stats

export default adminRouter;