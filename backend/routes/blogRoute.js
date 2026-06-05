import express from "express";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";

// Blog Category Controllers
import {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  getBlogCategoriesByCreator,
  updateBlogCategory,
  togglePublishBlogCategory,
  deleteBlogCategory,
} from "../controller/blogController.js";

// Blog Course Controllers
import {
  createBlogCourse,
  getBlogCoursesByCategory,
  getBlogCourseById,
  togglePublishBlogCourse,
  deleteBlogCourse,
} from "../controller/blogController.js";

// Blog Model Controllers
import {
  createBlogModel,
  getBlogModelsByCourse,
  getBlogModelById,
  togglePublishBlogModel,
  deleteBlogModel,
} from "../controller/blogController.js";

// Blog Topic Controllers
import {
  createBlogTopic,
  getBlogTopicsByModel,
  getBlogTopicById,
  editBlogTopic,
  togglePublishBlogTopic,
  deleteBlogTopic,
  likeBlogTopic,
  addBlogComment,
  addBlogReply,
  likeBlogComment,
  likeBlogReply,
  deleteBlogComment,
  deleteBlogReply,
} from "../controller/blogController.js";

const blogRoute = express.Router();

// ── BLOG CATEGORY ROUTES ──────────────────────────────────────────

// Create Blog Category (Educator/Admin only)
blogRoute.post("/category/create", isAuth, isRole("educator"), createBlogCategory);

// Get All Published Blog Categories (Public)
blogRoute.get("/categories", getAllBlogCategories);

// Get Blog Categories By Creator (Educator/Admin only)
blogRoute.get("/categories/creator", isAuth, isRole("educator"), getBlogCategoriesByCreator);

// Get Blog Category By ID (Public)
blogRoute.get("/category/:categoryId", getBlogCategoryById);

// Update Blog Category (Educator/Admin only)
blogRoute.put("/category/:categoryId", isAuth, isRole("educator"), updateBlogCategory);

// Toggle Publish Blog Category (Educator/Admin only)
blogRoute.put("/category/publish/:categoryId", isAuth, isRole("educator"), togglePublishBlogCategory);

// Delete Blog Category (Educator/Admin only)
blogRoute.delete("/category/:categoryId", isAuth, isRole("educator"), deleteBlogCategory);

// ── BLOG COURSE ROUTES ──────────────────────────────────────────

// Create Blog Course (Educator/Admin only)
blogRoute.post("/course/create/:blogCategoryId", isAuth, isRole("educator"), createBlogCourse);

// Get Blog Courses by Category (Public)
blogRoute.get("/courses/:blogCategoryId", getBlogCoursesByCategory);

// Get Blog Course By ID (Public)
blogRoute.get("/course/:blogCourseId", getBlogCourseById);

// Toggle Publish Blog Course (Educator/Admin only)
blogRoute.put("/course/publish/:blogCourseId", isAuth, isRole("educator"), togglePublishBlogCourse);

// Delete Blog Course (Educator/Admin only)
blogRoute.delete("/course/:blogCourseId", isAuth, isRole("educator"), deleteBlogCourse);

// ── BLOG MODEL ROUTES ──────────────────────────────────────────

// Create Blog Model (Educator/Admin only)
blogRoute.post("/model/create/:blogCourseId", isAuth, isRole("educator"), createBlogModel);

// Get Blog Models by Course (Public)
blogRoute.get("/models/:blogCourseId", getBlogModelsByCourse);

// Get Blog Model By ID (Public)
blogRoute.get("/model/:blogModelId", getBlogModelById);

// Toggle Publish Blog Model (Educator/Admin only)
blogRoute.put("/model/publish/:blogModelId", isAuth, isRole("educator"), togglePublishBlogModel);

// Delete Blog Model (Educator/Admin only)
blogRoute.delete("/model/:blogModelId", isAuth, isRole("educator"), deleteBlogModel);

// ── BLOG TOPIC ROUTES ──────────────────────────────────────────

// Create Blog Topic (Educator/Admin only)
blogRoute.post("/topic/create/:blogModelId", isAuth, isRole("educator"), createBlogTopic);

// Get Blog Topics by Model (Public)
blogRoute.get("/topics/:blogModelId", getBlogTopicsByModel);

// Get Blog Topic By ID (Public)
blogRoute.get("/topic/:blogTopicId", getBlogTopicById);

// Edit Blog Topic (Educator/Admin only)
blogRoute.put("/topic/edit/:blogTopicId", isAuth, isRole("educator"), upload.single("thumbnail"), editBlogTopic);

// Toggle Publish Blog Topic (Educator/Admin only)
blogRoute.put("/topic/publish/:blogTopicId", isAuth, isRole("educator"), togglePublishBlogTopic);

// Delete Blog Topic (Educator/Admin only)
blogRoute.delete("/topic/:blogTopicId", isAuth, isRole("educator"), deleteBlogTopic);

// Like Blog Topic (Authenticated users)
blogRoute.put("/topic/like/:blogTopicId", isAuth, likeBlogTopic);

// ── BLOG COMMENT ROUTES ──────────────────────────────────────────

// Add Comment to Blog Topic (Authenticated users)
blogRoute.post("/topic/comment/:blogTopicId", isAuth, addBlogComment);

// Add Reply to Comment (Authenticated users)
blogRoute.post("/topic/comment/reply/:blogTopicId/:commentId", isAuth, addBlogReply);

// Like Comment (Authenticated users)
blogRoute.put("/topic/comment/like/:blogTopicId/:commentId", isAuth, likeBlogComment);

// Like Reply (Authenticated users)
blogRoute.put("/topic/comment/reply/like/:blogTopicId/:commentId/:replyId", isAuth, likeBlogReply);

// Delete Comment (Educator/Admin or comment owner)
blogRoute.delete("/topic/comment/:blogTopicId/:commentId", isAuth, deleteBlogComment);

// Delete Reply (Educator/Admin or reply owner)
blogRoute.delete("/topic/comment/reply/:blogTopicId/:commentId/:replyId", isAuth, deleteBlogReply);

export default blogRoute;
