import mongoose from "mongoose";

/* =========================
   COMMENT SCHEMA
========================= */
const blogCommentSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Comment too long"],
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

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
        maxlength: [500, "Reply too long"],
      },

      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

}, { timestamps: true });

/* =========================
   MAIN BLOG TOPIC SCHEMA
========================= */
const blogTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    // 🔗 Blog Model reference
    blogModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogModel",
      required: true,
    },

    // 👨‍🏫 creator
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👁️ views
    views: {
      type: Number,
      default: 0,
    },

    // 👍 likes
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    // 💬 comments
    comments: [blogCommentSchema],

    // 📢 publish status
    isPublished: {
      type: Boolean,
      default: false,
    },

    // 🏷️ tags
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// 📌 Index for performance
blogTopicSchema.index({ slug: 1, blogModel: 1, isPublished: 1 });
blogTopicSchema.index({ tags: 1 });

const BlogTopic = mongoose.model("BlogTopic", blogTopicSchema);

export default BlogTopic;
