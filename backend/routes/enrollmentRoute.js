// routes/enrollmentRoute.js

import express from "express";
import {
  enrollCourse,
  getUserEnrollments,
  checkEnrollmentStatus,
} from "../controller/enrollMentController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// ======================================================
// 🎓 ENROLL FREE COURSE
// ======================================================

router.post("/enroll/:courseId", isAuth, enrollCourse);

// ======================================================
// 📦 GET USER ENROLLMENTS
// ======================================================

router.get("/user", isAuth, getUserEnrollments);

// ======================================================
// 🔍 CHECK ENROLLMENT STATUS
// ======================================================

router.get("/check/:courseId", isAuth, checkEnrollmentStatus);

export default router;
