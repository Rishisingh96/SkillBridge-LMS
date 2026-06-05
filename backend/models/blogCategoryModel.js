import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

    icon: {
      type: String,
      default: "",
    },

    // 📚 Blog Courses in this category
    blogCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCourse",
      },
    ],

    // 👨‍🏫 category creator
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
blogCategorySchema.index({ slug: 1, isPublished: 1 });

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

export default BlogCategory;
