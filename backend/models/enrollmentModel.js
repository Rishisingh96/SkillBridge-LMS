import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // 👤 User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 📚 Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // 🎟️ Coupon Reference
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    // 🏷️ Snapshot Coupon Code
    couponCode: {
      type: String,
      default: "",
    },

    // 💰 Original Course Price
    originalPrice: {
      type: Number,
      required: true,
    },

    // 🎁 Snapshot Discount
    discountAmount: {
      type: Number,
      default: 0,
    },

    // 💵 Final Paid Amount
    pricePaid: {
      type: Number,
      required: true,
    },

    // 👤 Checkout Details
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
    },

    studentPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // 💳 Payment
    paymentId: {
      type: String,
      default: "",
    },

    orderId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // ⏳ Subscription Start
    startDate: {
      type: Date,
      default: Date.now,
    },

    // ⏳ Subscription End
    endDate: {
      type: Date,
      required: true,
    },

    // 📌 Active / Expired
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// 🚨 prevent duplicate enrollment
enrollmentSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

const Enrollment = mongoose.model(
  "Enrollment",
  enrollmentSchema
);

export default Enrollment;