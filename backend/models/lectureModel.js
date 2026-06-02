import mongoose from "mongoose";

/* =========================
   QUIZ QUESTION SCHEMA
========================= */
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },

  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 2;
      },
      message: "At least 2 options required",
    },
  },

  correctAnswer: {
    type: String,
    required: true,
  },
});

/* =========================
   RESOURCE SCHEMA
========================= */
const resourceSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  publicId: String,
  resourceType: String,

  fileType: {
    type: String,
    enum: ["pdf", "image", "zip", "doc"],
  },

  downloads: {
    type: Number,
    default: 0,
  },

  downloadLogs: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      downloadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

/* =========================
   VIDEO SCHEMA
========================= */
const videoSchema = new mongoose.Schema({
  fileUrl: String,
  publicId: String,
  resourceType: String,

  duration: Number, // in seconds

  views: {
    type: Number,
    default: 0,
  },
});

/* =========================
   QUIZ ATTEMPT SCHEMA
========================= */
const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  score: {
    type: Number,
    default: 0,
  },

  total: Number,

  correctAnswers: Number,

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

/* =========================
   COMMENT SCHEMA
========================= */
const commentSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Comment too long"],  // ✅ limit add karo
  },

  image: {
    fileUrl: String,
    publicId: String,
  },

  // ✅ Likes add karo — har LMS mein hota hai
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  // ✅ Pinned comment — educator important comment pin kare
  isPinned: {
    type: Boolean,
    default: false,
  },

  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "Reply too long"],  // ✅ limit
      },

      image: {          // ✅ reply mein bhi image
        fileUrl: String,
        publicId: String,
      },

      likes: [{         // ✅ reply pe bhi like
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

}, { timestamps: true });  // ✅ createdAt manually mat likho — timestamps karta hai automatically

/* =========================
   MAIN LECTURE SCHEMA
========================= */
const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
      trim: true,
    },

    module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },

    description: {
      type: String,
      default: "",
    },

    video: videoSchema,

    isPreviewFree: {
      type: Boolean,
      default: false,
    },

    resources: [resourceSchema],

    quizQuestions: [questionSchema],

    quizAttempts: [quizAttemptSchema],

    comments: [commentSchema],

  },
  {
    timestamps: true,
  }
);

// MODEL EXPORT
const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;