// controller/enrollMentController.js

import Course from "../model/courseModel.js";
import Enrollment from "../model/enrollmentSchema.js";
import User from "../model/userModel.js";

// ======================================
// FREE COURSE ENROLLMENT
// ======================================

export const enrollCourse = async (req, res) => {

  try {

    const { courseId } = req.params;

    const userId = req.userId;

    // Find User
    const user = await User.findById(userId);

    // Find Course
    const course = await Course.findById(courseId);

    // Check User & Course
    if (!user || !course) {

      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });

    }

    // Block Paid Course
    if (course.price > 0) {

      return res.status(400).json({
        success: false,
        message: "Paid course requires payment",
      });

    }

    // Already Enrolled Check
    const alreadyEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyEnrolled) {

      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });

    }

    // Dates
    const startDate = new Date();

    const endDate = new Date(startDate);

    // Validity
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

    // Create Enrollment
    const enrollment = await Enrollment.create({

      user: userId,
      course: courseId,

      pricePaid: 0,

      startDate,
      endDate,

      status: "active",

    });

    // Add Course To User
    user.enrolledCourses.push(courseId);

    await user.save();

    return res.status(201).json({

      success: true,

      message: "Free course enrolled successfully",

      enrollment,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: `Enroll error: ${error.message}`,

    });

  }

};

// ======================================
// CHECK ENROLLMENT STATUS
// ======================================

export const checkEnrollmentStatus = async (req, res) => {

  try {

    const { courseId } = req.params;

    const userId = req.userId;

    // Find Enrollment
    const enrollment = await Enrollment.findOne({

      user: userId,
      course: courseId,

    }).populate("course");

    // Not Enrolled
    if (!enrollment) {

      return res.status(200).json({

        success: true,

        isEnrolled: false,

        isActive: false,

        message: "Not enrolled",

      });

    }

    // Current Date
    const now = new Date();

    // Check Expired
    const isExpired = now > enrollment.endDate;

    // Update Status
    if (isExpired && enrollment.status !== "expired") {

      enrollment.status = "expired";

      await enrollment.save();

        // REMOVE COURSE FROM USER
   await User.findByIdAndUpdate(
      userId,
      {
         $pull:{
            enrolledCourses: courseId
         }
      }
   );

    }

    // Days Remaining
    const daysRemaining = Math.max(

      0,

      Math.ceil(
        (enrollment.endDate - now) /
        (1000 * 60 * 60 * 24)
      )

    );

    return res.status(200).json({

      success: true,

      isEnrolled: true,

      isActive: !isExpired,

      status: enrollment.status,

      startDate: enrollment.startDate,

      endDate: enrollment.endDate,

      daysRemaining,

      enrollment,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: `Error checking enrollment: ${error.message}`,

    });

  }

};