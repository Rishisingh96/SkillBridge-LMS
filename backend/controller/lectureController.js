// Import Course model
import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";

// Create lecture
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "lectureTitle and courseId are required",
      });
    }

    // Create Lecture
    const lecture = await Lecture.create({
      lectureTitle,
    });

    // Find Course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Push lecture
    course.lectures.push(lecture._id);

    await course.save();

    await course.populate("lectures");

    return res.status(201).json({
      message: "Lecture created successfully",
      lecture,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Create lecture error ${error}`,
    });
  }
};

// Get Course Lecture
export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course is not found" });
    }
    await course.populate("lectures");
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get course lecture error ${error}` });
  }
};

// Edit lecture
export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" });
    }
    let videoUrl;
    if (req.file) {
      videoUrl = await uploadOnCloudinary(req.file.path)
      lecture.videoUrl = videoUrl
    }
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle
    }
    lecture.isPreviewFree = isPreviewFree
    await lecture.save();
    return res.status(200).json({ lecture });
  } catch (error) {
    return res.status(500).json({ message: `Edit lecture error ${error}` });
  }
};

// Remove lecture
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params
    const lecture = await Lecture.findByIdAndDelete(lectureId)
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" })
    }
    await Course.updateOne({ lectures: lectureId },
      { $pull: { lectures: lectureId } })
    return res.status(200).json({ message: "Lecture removed successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Remove lecture error ${error}` });
  }
}


