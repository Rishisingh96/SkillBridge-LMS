import mongoose from "mongoose";

const blogCourseSchema = new mongoose.Schema(
  {
    name: {
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

    thumbnail: {
      type: String,
      default: "",
    },

    // 📚 Blog Models (sections of blog course)
    blogModels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogModel",
      },
    ],

    // 🔗 Blog Category reference
    blogCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    // 👨‍🏫 course creator
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
blogCourseSchema.index({ slug: 1, blogCategory: 1, isPublished: 1 });

const BlogCourse = mongoose.model("BlogCourse", blogCourseSchema);

export default BlogCourse;
