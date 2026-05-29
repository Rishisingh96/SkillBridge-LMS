import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";

export const isCourseActive = async (userId, courseId) => {
  try {
    // find enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    // no enrollment
    if (!enrollment) {
      return false;
    }

    const now = new Date();

    

    // ======================================
    // 1. already marked expired
    // ======================================
    if (enrollment.status === "expired") {
      await User.findByIdAndUpdate(userId, {
        $pull: { enrolledCourses: courseId },
      });

      return false;
    }

    // ======================================
    // 2. check actual expiry
    // ======================================
    if (now > enrollment.endDate) {
      await Enrollment.findByIdAndUpdate(enrollment._id, {
        status: "expired",
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { enrolledCourses: courseId },
      });

      return false;
    }

    // ======================================
    // 3. active course
    // ======================================
    return true;

  } catch (error) {
    console.log("isCourseActive error:", error);
    return false;
  }
};