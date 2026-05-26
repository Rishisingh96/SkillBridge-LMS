import express from "express";
import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";
import upload from "../middleware/multer.js";
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  getEnrolledCourses,
  deleteAccount,
  getUserById,
} from "../controller/userController.js";

const userRouter = express.Router();

// ── Current User ───────────────────────────
userRouter.get("/getcurrentuser", isAuth, getCurrentUser);

// ── Update Profile ─────────────────────────
userRouter.put("/updateprofile", isAuth, upload.single("photo"), updateProfile);

// ── Change Password ────────────────────────
userRouter.put("/changepassword", isAuth, changePassword);

// ── Enrolled Courses ───────────────────────
userRouter.get("/enrolledcourses", isAuth, getEnrolledCourses);

// ── Delete Account ─────────────────────────
userRouter.delete("/deleteaccount", isAuth, deleteAccount);

// ── Get User by ID (Admin use) ─────────────
userRouter.get("/:userId", isAuth, isRole("admin"), getUserById);

export default userRouter;