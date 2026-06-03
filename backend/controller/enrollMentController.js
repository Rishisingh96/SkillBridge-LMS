// controller/enrollMentController.js

import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";
import { notifyCourseEnrollmentToCreatorAndAdmin } from "../helpers/notificationHelpers.js";
import { sendEnrollmentConfirmationEmail } from "../config/sendMail.js";

// ======================================================
// 🔥 FREE COURSE ENROLLMENT
// ======================================================

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // ======================================================
    // CHECK USER + COURSE
    // ======================================================

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    // BLOCK PAID COURSE
    if (course.price > 0) {
      return res.status(400).json({
        success: false,
        message: "Paid course requires payment",
      });
    }


    // AUTO EXPIRE OLD ENROLLMENTS
    await Enrollment.updateMany(
      {
        user: userId,
        course: courseId,
        endDate: { $lte: new Date() },
        status: "active",
      },
      {
        $set: {
          status: "expired",
        },
      }
    );

    // CHECK ACTIVE ENROLLMENT
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    // CALCULATE VALIDITY
    const startDate = new Date();
    const endDate = new Date(startDate);

    const { value = 6, unit = "month" } = course.validity || {};

    if (unit === "day") {
      endDate.setDate(endDate.getDate() + value);
    }

    if (unit === "month") {
      endDate.setMonth(endDate.getMonth() + value);
    }

    if (unit === "year") {
      endDate.setFullYear(endDate.getFullYear() + value);
    }

    // ======================================================
    // CREATE NEW ENROLLMENT
    // ======================================================

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      pricePaid: 0,
      startDate,
      endDate,
      status: "active",
    });

    // ======================================================
    // UPDATE USER
    // ======================================================

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        enrolledCourses: courseId,
      },
    });

    // After line 119 (after User.findByIdAndUpdate)
    await notifyCourseEnrollmentToCreatorAndAdmin({
      studentName: user.name,
      studentPhone: user.phone,
      courseId: course._id,
      courseTitle: course.title,
      educatorId: course.creator,
    });

    // Send enrollment confirmation email to student
    try {
      console.log("Sending enrollment email to:", user.email);
      await sendEnrollmentConfirmationEmail(
        user.email,
        user.name,
        course.title,
        startDate.toLocaleDateString(),
        endDate.toLocaleDateString()
      );
      console.log("Enrollment email sent successfully");
    } catch (emailError) {
      console.error("Failed to send enrollment email:", emailError);
      // Don't fail the enrollment if email fails
    }

    return res.status(201).json({
      success: true,
      message: "Free course enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.log("Enroll Course Error:", error);

    return res.status(500).json({
      success: false,
      message: `Enroll error: ${error.message}`,
    });
  }
};

// ======================================================
// 📦 GET USER ENROLLMENTS
// ======================================================

export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    // ======================================================
    // AUTO UPDATE EXPIRED ENROLLMENTS IN DATABASE
    // ======================================================

    const updateResult = await Enrollment.updateMany(
      {
        user: userId,
        endDate: { $lte: now },
        status: "active",
      },
      {
        $set: {
          status: "expired",
        },
      }
    );

    console.log("Updated expired enrollments:", updateResult.modifiedCount);

    // ======================================================
    // REMOVE EXPIRED COURSE IDS FROM USER
    // ======================================================

    const expiredCourses = await Enrollment.find({
      user: userId,
      status: "expired",
    });

    for (const item of expiredCourses) {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          enrolledCourses: item.course,
        },
      });
    }

    // ======================================================
    // GET ALL ENROLLMENTS
    // ======================================================

    const enrollments = await Enrollment.find({
      user: userId,
    })
      .populate("course", "title thumbnail price category level creator")
      .populate("course.creator", "name photoUrl")
      .sort({ createdAt: -1 });

    const result = enrollments.map((enrollment) => {
      const isExpired = now > new Date(enrollment.endDate);

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (new Date(enrollment.endDate) - now) /
          (1000 * 60 * 60 * 24)
        )
      );

      return {
        ...enrollment._doc,
        isExpired,
        isActive: !isExpired,
        status: isExpired ? "expired" : "active",
        daysRemaining,
      };
    });

    return res.status(200).json({
      success: true,
      enrollments: result,
    });
  } catch (error) {
    console.log("Get Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: `Error getting enrollments: ${error.message}`,
    });
  }
};

// ======================================================
// 🔍 CHECK ENROLLMENT STATUS
// ======================================================

export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // ======================================================
    // FIND LATEST ENROLLMENT
    // ======================================================

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    }).sort({ createdAt: -1 });

    // ======================================================
    // NO ENROLLMENT
    // ======================================================

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        isActive: false,
        status: "not_enrolled",
      });
    }

    // ======================================================
    // CHECK EXPIRY
    // ======================================================

    const now = new Date();
    const isExpired = now > new Date(enrollment.endDate);

    console.log("Enrollment check:", {
      courseId,
      userId,
      endDate: enrollment.endDate,
      now,
      isExpired,
      currentStatus: enrollment.status
    });

    // ======================================================
    // AUTO UPDATE STATUS IN DATABASE
    // ======================================================

    if (isExpired && enrollment.status !== "expired") {
      console.log("Updating enrollment to expired:", enrollment._id);
      await Enrollment.findByIdAndUpdate(enrollment._id, {
        status: "expired",
      });

      await User.findByIdAndUpdate(userId, {
        $pull: {
          enrolledCourses: courseId,
        },
      });
    }

    // ======================================================
    // EXPIRED RESPONSE
    // ======================================================

    if (isExpired) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        isActive: false,
        status: "expired",
        message: "Enrollment expired",
      });
    }

    // ======================================================
    // DAYS REMAINING
    // ======================================================

    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (new Date(enrollment.endDate) - now) /
        (1000 * 60 * 60 * 24)
      )
    );

    // ======================================================
    // ACTIVE RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      isEnrolled: true,
      isActive: true,
      status: "active",
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      daysRemaining,
      enrollment,
    });
  } catch (error) {
    console.log("Check Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: `Error checking enrollment: ${error.message}`,
    });
  }
};