import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";
import { sendEnrollmentConfirmationEmail } from "../config/sendMail.js";
import { notifyCourseEnrollmentToCreatorAndAdmin } from "../helpers/notificationHelpers.js";

// Calculate enrollment end date based on course validity
export const calculateEnrollmentEndDate = (validity) => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  const { value = 6, unit = "month" } = validity || {};

  if (unit === "day") {
    endDate.setDate(endDate.getDate() + value);
  } else if (unit === "month") {
    endDate.setMonth(endDate.getMonth() + value);
  } else if (unit === "year") {
    endDate.setFullYear(endDate.getFullYear() + value);
  }

  return { startDate, endDate };
};

// Create enrollment and update user
export const createEnrollment = async ({ userId, courseId, pricePaid, startDate, endDate, paymentDetails = {} }) => {
  // Create enrollment
  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    pricePaid,
    startDate,
    endDate,
    status: "active",
    ...paymentDetails,
  });

  // Update user's enrolled courses
  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      enrolledCourses: courseId,
    },
  });

  return enrollment;
};

// Send enrollment notifications (email + educator/admin notification)
export const sendEnrollmentNotifications = async ({ user, course, startDate, endDate }) => {
  // Send notification to educator and admin
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
};

// Auto-update expired enrollments for a user
export const updateExpiredEnrollments = async (userId) => {
  const now = new Date();

  // Update expired enrollments in database
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

  // Remove expired course IDs from user
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

  return updateResult.modifiedCount;
};

// Calculate days remaining for an enrollment
export const calculateDaysRemaining = (endDate) => {
  const now = new Date();
  return Math.max(
    0,
    Math.ceil(
      (new Date(endDate) - now) /
      (1000 * 60 * 60 * 24)
    )
  );
};
