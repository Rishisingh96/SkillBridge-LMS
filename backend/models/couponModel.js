import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // 🏷️ Coupon Code
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // 💸 fixed / percentage
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },

    // 💰 Discount Value
    discountValue: {
      type: Number,
      required: true,
    },

    // 🚫 Max Discount
    maxDiscount: {
      type: Number,
      default: 0,
    },

    // 🛒 Minimum Purchase
    minPurchase: {
      type: Number,
      default: 0,
    },

    // 📅 Expiry
    expiryDate: {
      type: Date,
      required: true,
    },

    // 🔢 Max Usage
    usageLimit: {
      type: Number,
      default: 100,
    },

    // 📈 Used Count
    usedCount: {
      type: Number,
      default: 0,
    },

    // 👥 Track users
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ Active / inactive
    isActive: {
      type: Boolean,
      default: true,
    },

    // 🌍 all / specific course
    couponFor: {
      type: String,
      enum: ["all", "specific"],
      default: "all",
    },

    // 📚 applicable courses
    applicableCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    // 👨‍🏫 creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🎭 role
    creatorRole: {
      type: String,
      enum: ["admin", "educator"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ⚡ indexes
couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1 });

const Coupon = mongoose.model(
  "Coupon",
  couponSchema
);

export default Coupon;