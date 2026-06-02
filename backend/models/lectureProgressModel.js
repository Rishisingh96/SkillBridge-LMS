import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },

    // Current video position
    currentPosition: {
      type: Number,
      default: 0,
    },

    watchTime: {
      type: Number,
      default: 0,
    },

    // Highest position reached
    maxPosition: {
      type: Number,
      default: 0,
    },

    // Percentage
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // Lecture completion status (user-specific)
    isLectureCompleted: {
      type: Boolean,
      default: false,
    },

    // Quiz completion status (user-specific)
    isQuizCompleted: {
      type: Boolean,
      default: false,
    },

    lectureCompletedAt: {
      type: Date,
      default: null,
    },

    quizCompletedAt: {
      type: Date,
      default: null,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

lectureProgressSchema.index(
  {
    user: 1,
    lecture: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "LectureProgress",
  lectureProgressSchema
);