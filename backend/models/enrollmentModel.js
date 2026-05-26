import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    pricePaid: {
      type: Number,
      required: true,
      default: 0,
    },

    // ⏳ subscription start time
    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // ⏳ subscription end time
    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    // 📌 active / expired status
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

// 🚨 Prevent duplicate enrollment (VERY IMPORTANT)
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// ⚡ Model
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;