import razorpay from "razorpay";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Coupon from "../models/couponModel.js";
import crypto from "crypto";
import { sendEnrollmentConfirmationEmail } from "../config/sendMail.js";
import { notifyCourseEnrollmentToCreatorAndAdmin } from "../helpers/notificationHelpers.js";

dotenv.config();

const RazorPayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);

// ======================================
// 1. CREATE ORDER
// ======================================

export const RazorPayOrder = async (req, res) => {
  try {
    const { courseId, discount } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Calculate final price after discount
    const finalPrice = Math.max(course.price - (discount || 0), 0);

    const options = {
      amount: finalPrice * 100,
      currency: "INR",
      receipt: `rcpt_${courseId.slice(-10)}_${Date.now()}`,
    };

    const order = await RazorPayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Failed to create order: ${error.message}`,
    });
  }
};

// ======================================
// 2. VERIFY PAYMENT + ENROLL (FIXED)
// ======================================

export const VerifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
      originalPrice,
      discountAmount,
      couponId,
      couponCode,
    } = req.body;

    const userId = req.userId;

    // ======================================
    // 1. VERIFY SIGNATURE (IMPORTANT FIX)
    // ======================================

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ======================================
    // 2. GET USER + COURSE
    // ======================================

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    // ======================================
    // 3. SAFE DUPLICATE CHECK
    // ======================================

    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      });
    }

    // ======================================
    // 4. VALIDITY CALCULATION
    // ======================================

    const startDate = new Date();
    const endDate = new Date(startDate);

    const { value = 6, unit = "month" } = course.validity || {};

    if (unit === "day") endDate.setDate(endDate.getDate() + value);
    if (unit === "month") endDate.setMonth(endDate.getMonth() + value);
    if (unit === "year") endDate.setFullYear(endDate.getFullYear() + value);

    // ======================================
    // 5. SAFE ENROLLMENT CREATE (NO DUPLICATE CRASH)
    // ======================================

    const enrollment = await Enrollment.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
      },
      {
        $set: {
          status: "active",
          pricePaid: course.price - (discountAmount || 0),
          startDate,
          endDate,
          paymentStatus: "paid",
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          originalPrice: originalPrice || course.price,
          discountAmount: discountAmount || 0,
          studentName: name || user.name,
          studentEmail: email || user.email,
          studentPhone: phone || user.phone,
          coupon: couponId || null,
          couponCode: couponCode || "",
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // ======================================
    // 6. SAFE USER UPDATE
    // ======================================

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    // ======================================
    // 7. UPDATE EDUCATOR TOTAL EARNINGS
    // ======================================

    const amountPaid = course.price - (discountAmount || 0);
    await User.findByIdAndUpdate(course.creator, {
      $inc: { totalEarnings: amountPaid },
    });

    // ======================================
    // 8. UPDATE COUPON USAGE IF APPLIED
    // ======================================

    if (couponId) {
      await Coupon.findByIdAndUpdate(couponId, {
        $inc: { usedCount: 1 },
        $addToSet: { usedBy: userId },
      });
    }

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

    return res.status(200).json({
      success: true,
      message: "Payment verified & enrollment successful",
      enrollment,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};