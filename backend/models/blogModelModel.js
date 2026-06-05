import mongoose from "mongoose";

const blogModelSchema = new mongoose.Schema(
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

    description: {
      type: String,
      default: "",
    },

    // 📚 Blog Topics (blog posts in this model)
    blogTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogTopic",
      },
    ],

    // 🔗 Blog Course reference
    blogCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCourse",
      required: true,
    },

    // 👨‍🏫 creator
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
  },
  { timestamps: true }
);

// 📌 Index for performance
blogModelSchema.index({ slug: 1, blogCourse: 1, isPublished: 1 });

const BlogModel = mongoose.model("BlogModel", blogModelSchema);

export default BlogModel;
