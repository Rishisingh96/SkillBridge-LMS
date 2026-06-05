import BlogCategory from "../models/blogCategoryModel.js";
import BlogCourse from "../models/blogCourseModel.js";
import BlogModel from "../models/blogModelModel.js";
import BlogTopic from "../models/blogTopicModel.js";
import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// ── BLOG CATEGORY CONTROLLERS ──────────────────────────

// Create Blog Category
export const createBlogCategory = async (req, res) => {
  try {
    const { name, slug, description, icon } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const blogCategory = await BlogCategory.create({
      name,
      slug,
      description,
      icon,
      creator: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Blog category created successfully",
      blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: `Create blog category error: ${error.message}` });
  }
};

// Get All Blog Categories
export const getAllBlogCategories = async (req, res) => {
  try {
    const blogCategories = await BlogCategory.find({ isPublished: true })
      .populate("creator", "name email photoUrl")
      .populate({
        path: "blogCourses",
        match: { isPublished: true },
        populate: {
          path: "blogModels",
          match: { isPublished: true },
          populate: {
            path: "blogTopics",
            match: { isPublished: true },
          },
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogCategories,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog categories: ${error.message}` });
  }
};

// Get Blog Category By ID
export const getBlogCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const blogCategory = await BlogCategory.findById(categoryId)
      .populate("creator", "name email photoUrl")
      .populate({
        path: "blogCourses",
        populate: {
          path: "blogModels",
          populate: {
            path: "blogTopics",
          },
        },
      });

    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    return res.status(200).json(blogCategory);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog category: ${error.message}` });
  }
};

// Get Blog Categories By Creator
export const getBlogCategoriesByCreator = async (req, res) => {
  try {
    const blogCategories = await BlogCategory.find({ creator: req.userId })
      .populate("creator", "name email photoUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogCategories,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch creator blog categories: ${error.message}` });
  }
};

// Update Blog Category
export const updateBlogCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, slug, description, icon } = req.body;

    const blogCategory = await BlogCategory.findById(categoryId);
    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;

    const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog category updated successfully",
      blogCategory: updatedBlogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to update blog category: ${error.message}` });
  }
};

// Toggle Publish Blog Category
export const togglePublishBlogCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const blogCategory = await BlogCategory.findById(categoryId);
    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    blogCategory.isPublished = !blogCategory.isPublished;
    await blogCategory.save();

    return res.status(200).json({
      success: true,
      message: blogCategory.isPublished
        ? "Blog category published successfully"
        : "Blog category unpublished successfully",
      blogCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: `Toggle publish error: ${error.message}` });
  }
};

// Delete Blog Category
export const deleteBlogCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const blogCategory = await BlogCategory.findById(categoryId);
    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    await BlogCategory.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Blog category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete blog category: ${error.message}` });
  }
};

// ── BLOG COURSE CONTROLLERS ──────────────────────────

// Create Blog Course
export const createBlogCourse = async (req, res) => {
  try {
    const { blogCategoryId } = req.params;
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const blogCategory = await BlogCategory.findById(blogCategoryId);
    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    const blogCourse = await BlogCourse.create({
      name,
      slug,
      description,
      blogCategory: blogCategoryId,
      creator: req.userId,
    });

    // Push Blog Course into Blog Category
    blogCategory.blogCourses.push(blogCourse._id);
    await blogCategory.save();

    return res.status(201).json({
      success: true,
      message: "Blog course created successfully",
      blogCourse,
    });
  } catch (error) {
    return res.status(500).json({ message: `Create blog course error: ${error.message}` });
  }
};

// Get Blog Courses by Category
export const getBlogCoursesByCategory = async (req, res) => {
  try {
    const { blogCategoryId } = req.params;

    const blogCategory = await BlogCategory.findById(blogCategoryId)
      .populate({
        path: "blogCourses",
        populate: {
          path: "blogModels",
          populate: {
            path: "blogTopics",
          },
        },
      });

    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    return res.status(200).json({
      success: true,
      blogCourses: blogCategory.blogCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog courses: ${error.message}` });
  }
};

// Get Blog Course By ID
export const getBlogCourseById = async (req, res) => {
  try {
    const { blogCourseId } = req.params;

    const blogCourse = await BlogCourse.findById(blogCourseId)
      .populate("creator", "name email photoUrl")
      .populate("blogCategory", "name slug")
      .populate({
        path: "blogModels",
        populate: {
          path: "blogTopics",
        },
      });

    if (!blogCourse) {
      return res.status(404).json({ message: "Blog course not found" });
    }

    return res.status(200).json(blogCourse);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog course: ${error.message}` });
  }
};

// Toggle Publish Blog Course
export const togglePublishBlogCourse = async (req, res) => {
  try {
    const { blogCourseId } = req.params;

    const blogCourse = await BlogCourse.findById(blogCourseId);
    if (!blogCourse) {
      return res.status(404).json({ message: "Blog course not found" });
    }

    blogCourse.isPublished = !blogCourse.isPublished;
    await blogCourse.save();

    return res.status(200).json({
      success: true,
      message: blogCourse.isPublished
        ? "Blog course published successfully"
        : "Blog course unpublished successfully",
      blogCourse,
    });
  } catch (error) {
    return res.status(500).json({ message: `Toggle publish error: ${error.message}` });
  }
};

// Delete Blog Course
export const deleteBlogCourse = async (req, res) => {
  try {
    const { blogCourseId } = req.params;

    const blogCourse = await BlogCourse.findById(blogCourseId);
    if (!blogCourse) {
      return res.status(404).json({ message: "Blog course not found" });
    }

    // Remove from Blog Category
    await BlogCategory.findByIdAndUpdate(blogCourse.blogCategory, {
      $pull: { blogCourses: blogCourseId },
    });

    await BlogCourse.findByIdAndDelete(blogCourseId);

    return res.status(200).json({
      success: true,
      message: "Blog course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete blog course: ${error.message}` });
  }
};

// ── BLOG MODEL CONTROLLERS ──────────────────────────

// Create Blog Model
export const createBlogModel = async (req, res) => {
  try {
    const { blogCourseId } = req.params;
    const { title, slug, description } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: "Title and slug are required" });
    }

    const blogCourse = await BlogCourse.findById(blogCourseId);
    if (!blogCourse) {
      return res.status(404).json({ message: "Blog course not found" });
    }

    const blogModel = await BlogModel.create({
      title,
      slug,
      description,
      blogCourse: blogCourseId,
      creator: req.userId,
    });

    // Push Blog Model into Blog Course
    blogCourse.blogModels.push(blogModel._id);
    await blogCourse.save();

    return res.status(201).json({
      success: true,
      message: "Blog model created successfully",
      blogModel,
    });
  } catch (error) {
    return res.status(500).json({ message: `Create blog model error: ${error.message}` });
  }
};

// Get Blog Models by Course
export const getBlogModelsByCourse = async (req, res) => {
  try {
    const { blogCourseId } = req.params;

    const blogCourse = await BlogCourse.findById(blogCourseId)
      .populate({
        path: "blogModels",
        populate: {
          path: "blogTopics",
        },
      });

    if (!blogCourse) {
      return res.status(404).json({ message: "Blog course not found" });
    }

    return res.status(200).json({
      success: true,
      blogModels: blogCourse.blogModels,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog models: ${error.message}` });
  }
};

// Get Blog Model By ID
export const getBlogModelById = async (req, res) => {
  try {
    const { blogModelId } = req.params;

    const blogModel = await BlogModel.findById(blogModelId)
      .populate("creator", "name email photoUrl")
      .populate("blogCourse", "name slug")
      .populate("blogTopics");

    if (!blogModel) {
      return res.status(404).json({ message: "Blog model not found" });
    }

    return res.status(200).json(blogModel);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog model: ${error.message}` });
  }
};

// Toggle Publish Blog Model
export const togglePublishBlogModel = async (req, res) => {
  try {
    const { blogModelId } = req.params;

    const blogModel = await BlogModel.findById(blogModelId);
    if (!blogModel) {
      return res.status(404).json({ message: "Blog model not found" });
    }

    blogModel.isPublished = !blogModel.isPublished;
    await blogModel.save();

    return res.status(200).json({
      success: true,
      message: blogModel.isPublished
        ? "Blog model published successfully"
        : "Blog model unpublished successfully",
      blogModel,
    });
  } catch (error) {
    return res.status(500).json({ message: `Toggle publish error: ${error.message}` });
  }
};

// Delete Blog Model
export const deleteBlogModel = async (req, res) => {
  try {
    const { blogModelId } = req.params;

    const blogModel = await BlogModel.findById(blogModelId);
    if (!blogModel) {
      return res.status(404).json({ message: "Blog model not found" });
    }

    // Remove from Blog Course
    await BlogCourse.findByIdAndUpdate(blogModel.blogCourse, {
      $pull: { blogModels: blogModelId },
    });

    await BlogModel.findByIdAndDelete(blogModelId);

    return res.status(200).json({
      success: true,
      message: "Blog model deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete blog model: ${error.message}` });
  }
};

// ── BLOG TOPIC CONTROLLERS ──────────────────────────

// Create Blog Topic
export const createBlogTopic = async (req, res) => {
  try {
    const { blogModelId } = req.params;
    const { title, slug, content, excerpt, tags } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ message: "Title, slug, and content are required" });
    }

    const blogModel = await BlogModel.findById(blogModelId);
    if (!blogModel) {
      return res.status(404).json({ message: "Blog model not found" });
    }

    const blogTopic = await BlogTopic.create({
      title,
      slug,
      content,
      excerpt,
      tags,
      blogModel: blogModelId,
      creator: req.userId,
    });

    // Push Blog Topic into Blog Model
    blogModel.blogTopics.push(blogTopic._id);
    await blogModel.save();

    return res.status(201).json({
      success: true,
      message: "Blog topic created successfully",
      blogTopic,
    });
  } catch (error) {
    return res.status(500).json({ message: `Create blog topic error: ${error.message}` });
  }
};

// Get Blog Topics by Model
export const getBlogTopicsByModel = async (req, res) => {
  try {
    const { blogModelId } = req.params;

    const blogModel = await BlogModel.findById(blogModelId).populate("blogTopics");

    if (!blogModel) {
      return res.status(404).json({ message: "Blog model not found" });
    }

    return res.status(200).json({
      success: true,
      blogTopics: blogModel.blogTopics,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog topics: ${error.message}` });
  }
};

// Get Blog Topic By ID
export const getBlogTopicById = async (req, res) => {
  try {
    const { blogTopicId } = req.params;

    const blogTopic = await BlogTopic.findById(blogTopicId)
      .populate("creator", "name email photoUrl")
      .populate("blogModel", "title slug")
      .populate({
        path: "blogModel",
        populate: {
          path: "blogCourse",
          populate: {
            path: "blogCategory",
          },
        },
      });

    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    // Increment views
    blogTopic.views += 1;
    await blogTopic.save();

    return res.status(200).json(blogTopic);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch blog topic: ${error.message}` });
  }
};

// Edit Blog Topic
export const editBlogTopic = async (req, res) => {
  try {
    const { blogTopicId } = req.params;
    const { title, slug, content, excerpt, tags, isPublished } = req.body;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (tags) updateData.tags = tags;
    if (typeof isPublished !== "undefined") {
      updateData.isPublished = isPublished === "true" || isPublished === true;
    }

    // Thumbnail upload
    if (req.file) {
      const thumbnailUrl = await uploadOnCloudinary(req.file.path);
      updateData.thumbnail = thumbnailUrl.fileUrl;
    }

    const updatedBlogTopic = await BlogTopic.findByIdAndUpdate(
      blogTopicId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog topic updated successfully",
      blogTopic: updatedBlogTopic,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to update blog topic: ${error.message}`,
    });
  }
};

// Toggle Publish Blog Topic
export const togglePublishBlogTopic = async (req, res) => {
  try {
    const { blogTopicId } = req.params;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    blogTopic.isPublished = !blogTopic.isPublished;
    await blogTopic.save();

    return res.status(200).json({
      success: true,
      message: blogTopic.isPublished
        ? "Blog topic published successfully"
        : "Blog topic unpublished successfully",
      blogTopic,
    });
  } catch (error) {
    return res.status(500).json({ message: `Toggle publish error: ${error.message}` });
  }
};

// Delete Blog Topic
export const deleteBlogTopic = async (req, res) => {
  try {
    const { blogTopicId } = req.params;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    // Remove from Blog Model
    await BlogModel.findByIdAndUpdate(blogTopic.blogModel, {
      $pull: { blogTopics: blogTopicId },
    });

    await BlogTopic.findByIdAndDelete(blogTopicId);

    return res.status(200).json({
      success: true,
      message: "Blog topic deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete blog topic: ${error.message}` });
  }
};

// Like Blog Topic
export const likeBlogTopic = async (req, res) => {
  try {
    const { blogTopicId } = req.params;
    const userId = req.userId;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const hasLiked = blogTopic.likes.includes(userId);

    if (hasLiked) {
      blogTopic.likes = blogTopic.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      blogTopic.likes.push(userId);
    }

    await blogTopic.save();

    return res.status(200).json({
      success: true,
      message: hasLiked ? "Blog topic unliked" : "Blog topic liked",
      liked: !hasLiked,
      likesCount: blogTopic.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: `Like blog topic error: ${error.message}` });
  }
};

// Add Comment to Blog Topic
export const addBlogComment = async (req, res) => {
  try {
    const { blogTopicId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const comment = {
      user: userId,
      message,
    };

    blogTopic.comments.push(comment);
    await blogTopic.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: blogTopic.comments[blogTopic.comments.length - 1],
    });
  } catch (error) {
    return res.status(500).json({ message: `Add comment error: ${error.message}` });
  }
};

// Add Reply to Comment
export const addBlogReply = async (req, res) => {
  try {
    const { blogTopicId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const comment = blogTopic.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      user: userId,
      message,
    };

    comment.replies.push(reply);
    await blogTopic.save();

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      reply: comment.replies[comment.replies.length - 1],
    });
  } catch (error) {
    return res.status(500).json({ message: `Add reply error: ${error.message}` });
  }
};

// Like Comment
export const likeBlogComment = async (req, res) => {
  try {
    const { blogTopicId, commentId } = req.params;
    const userId = req.userId;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const comment = blogTopic.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await blogTopic.save();

    return res.status(200).json({
      success: true,
      message: hasLiked ? "Comment unliked" : "Comment liked",
      liked: !hasLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: `Like comment error: ${error.message}` });
  }
};

// Like Reply
export const likeBlogReply = async (req, res) => {
  try {
    const { blogTopicId, commentId, replyId } = req.params;
    const userId = req.userId;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const comment = blogTopic.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const hasLiked = reply.likes.includes(userId);

    if (hasLiked) {
      reply.likes = reply.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      reply.likes.push(userId);
    }

    await blogTopic.save();

    return res.status(200).json({
      success: true,
      message: hasLiked ? "Reply unliked" : "Reply liked",
      liked: !hasLiked,
      likesCount: reply.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: `Like reply error: ${error.message}` });
  }
};

// Delete Comment
export const deleteBlogComment = async (req, res) => {
  try {
    const { blogTopicId, commentId } = req.params;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    blogTopic.comments = blogTopic.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await blogTopic.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Delete comment error: ${error.message}` });
  }
};

// Delete Reply
export const deleteBlogReply = async (req, res) => {
  try {
    const { blogTopicId, commentId, replyId } = req.params;

    const blogTopic = await BlogTopic.findById(blogTopicId);
    if (!blogTopic) {
      return res.status(404).json({ message: "Blog topic not found" });
    }

    const comment = blogTopic.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies = comment.replies.filter(
      (reply) => reply._id.toString() !== replyId
    );
    await blogTopic.save();

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Delete reply error: ${error.message}` });
  }
};
