import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subTitle: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    // ⏳ COURSE VALIDITY CONFIG
    validity: {
      value: {
        type: Number,
        default: 6, // default 6
      },
      unit: {
        type: String,
        enum: ["day", "month", "year"],
        default: "month",
      },
    },

    // 📚 MODULES (sections of course)
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    // // � LECTURES (direct lectures for course)
    // lectures: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Lecture",
    //   },
    // ],

    // �👨‍🏫 course creator
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📢 publish status
    isPublished: {
      type: Boolean,
      default: false,
    },

    // ⭐ reviews
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// 📌 Index for performance (important for search/filter)
courseSchema.index({ category: 1, level: 1, isPublished: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;