// Import Course model
import Course from "../models/courseModel.js";
import Module from "../models/moduleModel.js";
import Lecture from "../models/lectureModel.js";

// Create Module 
export const createModule = async (req, res) => {

  try {

    const { courseId } = req.params

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

    const course = await Course.findById(courseId)
      .populate({
        path: "modules",
        populate: {
          path: "lectures",
        },
      });

    if (!course) {

      return res.status(404).json({
        message: "Course not found",
      });

    }

    return res.status(200).json({

      success: true,

      modules: course.modules,

    });

  } catch (error) {

    return res.status(500).json({

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
      _id: { $in: module.lectures }
    });

    // Remove Module From Course
    await Course.findByIdAndUpdate(
      module.course,
      {
        $pull: {
          modules: moduleId,
        },
      }
    );

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
        _id: { $in: module.lectures }
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

      message:
        "All modules removed successfully",

    });

  } catch (error) {

    return res.status(500).json({

      message:
        `Remove all modules error ${error.message}`,

    });

  }

};