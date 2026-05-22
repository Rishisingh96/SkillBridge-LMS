import razorpay from "razorpay";
import dotenv from "dotenv";
import Course from "../model/courseModel.js";
import User from "../model/userModel.js";
import Enrollment from "../model/enrollmentSchema.js";

dotenv.config();

const RazorPayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// temporarily add this:
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);

// 1. CREATE ORDER (DO NOT REMOVE)
export const RazorPayOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const options = {
      amount: course.price * 100, // paise
      currency: "INR",
      receipt: `rcpt_${courseId.slice(-12)}_${Date.now().toString().slice(-8)}`,
    };

    const order = await RazorPayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Failed to create Razorpay order: ${error.message}`,
    });
  }
};



// ======================================
// 2. VERIFY PAYMENT + ENROLL
// ======================================
export const VerifyPayment = async (req, res) => {
  try {

    const {
      courseId,
      razorpay_order_id,
    } = req.body;

    // ✅ secure user
    const userId = req.userId;

    // fetch payment
    const orderInfo = await RazorPayInstance.orders.fetch(
      razorpay_order_id
    );

    if (orderInfo.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }

    const user = await User.findById(userId);

    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        message: "User or Course not found",
      });
    }

    // duplicate check
    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    // validity
    const startDate = new Date();

    const endDate = new Date(startDate);

    const { value = 6, unit = "month" } =
      course.validity || {};

    if (unit === "day") {
      endDate.setDate(endDate.getDate() + value);
    }

    if (unit === "month") {
      endDate.setMonth(endDate.getMonth() + value);
    }

    if (unit === "year") {
      endDate.setFullYear(endDate.getFullYear() + value);
    }

    // enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      pricePaid: course.price,
      startDate,
      endDate,
    });

    // update user
    user.enrolledCourses.push(courseId);

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified & enrollment successful",
      enrollment,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: `Internal server error: ${error.message}`,
    });
  }
};