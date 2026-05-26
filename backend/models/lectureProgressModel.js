import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },

  watched: {
    type: Boolean,
    default: false,
  },

  watchTime: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: Date,

}, {
  timestamps: true,
});

//  Prevent duplicate progress
lectureProgressSchema.index(
  { user: 1, lecture: 1 },
  { unique: true }
);

const LectureProgress = mongoose.model(
  "LectureProgress",
  lectureProgressSchema
);

export default LectureProgress;