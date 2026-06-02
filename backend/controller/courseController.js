// Import Course model
import Course from "../models/courseModel.js"
import User from "../models/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import { mergeUserProgressWithModules } from "./progressController.js"

// ── Create Course ──────────────────────────
export const createCourse = async (req, res) => {
  try {
    const { title, category, description, validity } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    const safeValidity = validity || { value: 6, unit: "month" };

    const course = await Course.create({
      title,
      category,
      description,
      validity: safeValidity,
      creator: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });

  } catch (error) {
    return res.status(500).json({ message: `Create course error: ${error.message}` });
  }
};

// ── Toggle Publish ─────────────────────────
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    return res.status(200).json({
      success: true,
      message: course.isPublished
        ? "Course published successfully"
        : "Course unpublished successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({ message: `Toggle publish error: ${error.message}` });
  }
};

// ── Get Published Courses ──────────────────
export const getPublishedCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ isPublished: true })
      .populate({
        path: "modules",
        populate: {
          path: "lectures",
          model: "Lecture",
        },
      })
      .populate({
        path: "creator",
        select: "name email photoUrl role",
      })
      .populate("reviews");

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No published courses found" });
    }

    // Merge user progress with modules if user is authenticated
    if (userId) {
      for (const course of courses) {
        if (course.modules && course.modules.length > 0) {
          try {
            course.modules = await mergeUserProgressWithModules(course.modules, userId);
          } catch (error) {
            console.error("Error merging progress for course:", course._id, error);
            // Keep original modules if merge fails
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });

  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch courses: ${error.message}` });
  }
};

// ── Get Creator Courses ────────────────────
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;

    const courses = await Course.find({ creator: userId })
      .populate({
        path: "modules",
        populate: {
          path: "lectures",
          model: "Lecture",
        },
      })
      .populate("creator", "name email photoUrl role");

    if (!courses) {
      return res.status(404).json({ message: "Courses not found" });
    }

    // Merge user progress with modules if user is authenticated
    if (userId) {
      for (const course of courses) {
        if (course.modules && course.modules.length > 0) {
          try {
            course.modules = await mergeUserProgressWithModules(course.modules, userId);
          } catch (error) {
            console.error("Error merging progress for course:", course._id, error);
            // Keep original modules if merge fails
          }
        }
      }
    }

    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch courses: ${error.message}` });
  }
};

// ── Get Creator By ID ──────────────────────
export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Failed to get creator: ${error.message}` });
  }
};

// ── Edit Course ────────────────────────────
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (subTitle) updateData.subTitle = subTitle;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (level) updateData.level = level;

    if (price !== undefined) {
      updateData.price = Number(price);
    }

    // Validity update
    if (req.body["validity.value"] && req.body["validity.unit"]) {
      updateData.validity = {
        value: Number(req.body["validity.value"]),
        unit: req.body["validity.unit"],
      };
    }

    // Boolean handle
    if (typeof isPublished !== "undefined") {
      updateData.isPublished = isPublished === "true";
    }

    // Thumbnail upload
    if (req.file) {
      const thumbnailUrl = await uploadOnCloudinary(req.file.path);
      updateData.thumbnail = thumbnailUrl.fileUrl;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to update course: ${error.message}`,
    });
  }
};

// ── Get Course By ID ───────────────────────
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const course = await Course.findById(courseId)
      .populate("creator", "name email photoUrl")
      .populate({
        path: "modules",
        populate: {
          path: "lectures",
          model: "Lecture",
        },
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Merge user progress with modules if user is authenticated
    if (userId && course.modules && course.modules.length > 0) {
      try {
        course.modules = await mergeUserProgressWithModules(course.modules, userId);
      } catch (error) {
        console.error("Error merging progress for course:", courseId, error);
        // Keep original modules if merge fails
      }
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch course: ${error.message}` });
  }
};

// ── Delete Course ──────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete course: ${error.message}` });
  }
};

// ── Get All Courses (Admin) ─────────────────
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("creator", "name email photoUrl role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch courses: ${error.message}` });
  }
};