// Import Course model
import Course from "../models/courseModel.js";
import Module from "../models/moduleModel.js";
import Lecture from "../models/lectureModel.js";
import { mergeUserProgressWithModules } from "./progressController.js";

// Create Module
export const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { title, description } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        message: "Module title is required",
      });
    }

    // Find Course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Create Module
    const module = await Module.create({
      title,

      description,

      course: courseId,
    });

    // Push Module into Course
    course.modules.push(module._id);

    await course.save();

    return res.status(201).json({
      success: true,

      message: "Module created successfully",

      module,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Create module error ${error.message}`,
    });
  }
};

// Get All Modules
export const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    console.log("===== GET COURSE MODULES DEBUG =====");
    console.log("Course ID:", courseId);
    console.log("User ID:", userId);

    const course = await Course.findById(courseId);
    console.log("Course found:", course);
    console.log("Course modules raw:", course?.modules);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Fetch modules separately and populate lectures
    const modules = await Module.find({ course: courseId })
      .populate({
        path: "lectures",
        select: "title description lectures course order",
      })
      .sort({ order: 1 });

    console.log("Fetched modules:", modules);
    console.log("Modules length:", modules?.length);

    let modulesWithLectures = [];

    for (const module of modules) {
      console.log(`Module ${module._id} lectures:`, module.lectures);
      
      const moduleWithStats = {
        ...module.toObject(),
        totalLectures: module.lectures?.length || 0,
        totalDuration: module.lectures?.reduce(
          (sum, lecture) => sum + (lecture.video?.duration || 0),
          0,
        ) || 0,
      };
      
      modulesWithLectures.push(moduleWithStats);
    }

    let totalCourseLectures = modulesWithLectures.reduce((sum, mod) => sum + mod.totalLectures, 0);
    let totalCourseDuration = modulesWithLectures.reduce((sum, mod) => sum + mod.totalDuration, 0);

    // Merge user progress with modules if user is authenticated
    let finalModules = modulesWithLectures;
    if (userId && modulesWithLectures.length > 0) {
      try {
        finalModules = await mergeUserProgressWithModules(modulesWithLectures, userId);
        console.log("Progress merged modules:", finalModules);
      } catch (error) {
        console.error("Error merging progress:", error);
      }
    }

    console.log("Final modules to send:", finalModules);
    console.log("Total lectures:", totalCourseLectures);
    console.log("Total duration:", totalCourseDuration);

    return res.status(200).json({
      success: true,
      totalModules: modules.length,
      totalLectures: totalCourseLectures,
      totalDuration: totalCourseDuration,
      modules: finalModules,
    });
  } catch (error) {
    console.log("Get modules error:", error);
    return res.status(500).json({
      success: false,
      message: `Get modules error ${error.message}`,
    });
  }
};

//remove module by Module id
export const removeModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Find Module
    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    // Delete All Lectures Inside Module
    await Lecture.deleteMany({
      _id: { $in: module.lectures },
    });

    // Remove Module From Course
    await Course.findByIdAndUpdate(module.course, {
      $pull: {
        modules: moduleId,
      },
    });

    // Delete Module
    await Module.findByIdAndDelete(moduleId);

    return res.status(200).json({
      success: true,

      message: "Module removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Remove module error ${error.message}`,
    });
  }
};

//remove all modules by course id
export const removeAllModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find Course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Find All Modules
    const modules = await Module.find({
      course: courseId,
    });

    // Delete Lectures Inside Every Module
    for (const module of modules) {
      await Lecture.deleteMany({
        _id: { $in: module.lectures },
      });
    }

    // Delete All Modules
    await Module.deleteMany({
      course: courseId,
    });

    // Clear Modules Array
    course.modules = [];

    await course.save();

    return res.status(200).json({
      success: true,

      message: "All modules removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Remove all modules error ${error.message}`,
    });
  }
};
