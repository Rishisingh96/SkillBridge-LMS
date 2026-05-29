// Import Course model
import Course from "../models/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import Module from "../models/moduleModel.js";
 

// create Lecture 
export const createLecture = async (req, res) => {

  try {

    const { moduleId } = req.params;

    const { lectureTitle } = req.body;

    // Validation
    if (!lectureTitle) {

      return res.status(400).json({
        message: "Lecture title is required",
      });

    }

    // Find Module
    const module = await Module.findById(moduleId);

    if (!module) {

      return res.status(404).json({
        message: "Module not found",
      });

    }

    // Create Lecture
    const lecture = await Lecture.create({
      lectureTitle,
    });

    // Push Lecture Into Module
    module.lectures.push(lecture._id);

    await module.save();

    return res.status(201).json({

      success: true,

      message: "Lecture created successfully",

      lecture,

      module,

    });

  } catch (error) {

    return res.status(500).json({

      message: `Create lecture error ${error.message}`,

    });

  }

};

// Get Course Lecture
export const getCourseLectures = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module is not found" });
    }
    await module.populate("lectures");
    return res.status(200).json(module);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get course lecture error ${error}` });
  }
};


export const editLecture = async (req, res) => {

  try {

    const { lectureId } = req.params;

    const {
      isPreviewFree,
      lectureTitle,
      description,
    } = req.body;

    // Find Lecture
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {

      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });

    }

    // =========================
    // VIDEO UPLOAD (MP4 Direct)
    // =========================
    if (req.file) {

      try {
        // Delete old video from cloudinary
        if (lecture.video?.publicId) {

          await cloudinary.uploader.destroy(
            lecture.video.publicId,
            {
              resource_type:
                lecture.video.resourceType || "video",
            }
          );

        }

        // Upload MP4 directly to Cloudinary
        const uploadedVideo =
          await uploadOnCloudinary(
            req.file.path
          );

        // Check if upload succeeded
        if (!uploadedVideo || !uploadedVideo.fileUrl) {
          throw new Error("Cloudinary upload failed - no fileUrl returned");
        }

        // Save Video URL
        lecture.video = {

          fileUrl:
            uploadedVideo.fileUrl,

          publicId:
            uploadedVideo.publicId,

          resourceType:
            uploadedVideo.resourceType || "video",

        };

      } catch (videoError) {
        console.error("Video upload error:", videoError);
        throw new Error(`Video upload failed: ${videoError.message}`);
      }

    }

    // =========================
    // UPDATE TITLE
    // =========================
    if (lectureTitle) {

      lecture.lectureTitle =
        lectureTitle;

    }

    // =========================
    // UPDATE DESCRIPTION
    // =========================
    if (description) {

      lecture.description =
        description;

    }

    // =========================
    // FREE PREVIEW
    // =========================
    lecture.isPreviewFree =
      isPreviewFree === "true" ||
      isPreviewFree === true;

    // Save
    await lecture.save();

    return res.status(200).json({

      success: true,

      message:
        "Lecture updated successfully",

      lecture,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        `Edit lecture error: ${error.message}`,

    });

  }

};

// remove lecture video
export const removeLectureVideo =
  async (req, res) => {

    try {

      const { lectureId } =
        req.params;

      const lecture =
        await Lecture.findById(
          lectureId
        );

      if (!lecture) {

        return res.status(404).json({
          message:
            "Lecture not found",
        });

      }

      // Delete From Cloudinary
      if (
        lecture.video?.publicId
      ) {

        await cloudinary.uploader.destroy(
          lecture.video.publicId,
          {
            resource_type:
              lecture.video.resourceType,
          }
        );

      }

      // Remove Video Data
      lecture.video = {};

      await lecture.save();

      return res.status(200).json({

        message:
          "Lecture video removed successfully",

      });

    } catch (error) {

      return res.status(500).json({

        message:
          `Remove video error ${error.message}`,

      });

    }

  };

// Remove Total Created lecture
export const removeLecture = async (
  req,
  res
) => {

  try {

    const { lectureId } =
      req.params;

    const lecture =
      await Lecture.findById(
        lectureId
      );

    if (!lecture) {

      return res.status(404).json({

        message:
          "Lecture is not found",

      });

    }

    // Delete Video
    if (
      lecture.video?.publicId
    ) {

      await cloudinary.uploader.destroy(
        lecture.video.publicId,
        {
          resource_type:
            lecture.video.resourceType,
        }
      );

    }

    // Delete Resources
    for (const resource of lecture.resources) {

      await cloudinary.uploader.destroy(
        resource.publicId,
        {
          resource_type:
            resource.resourceType,
        }
      );

    }

    // Delete Lecture
    await Lecture.findByIdAndDelete(
      lectureId
    );

    // Remove From Course
    await Course.updateOne(
      {
        lectures: lectureId,
      },
      {
        $pull: {
          lectures: lectureId,
        },
      }
    );

    return res.status(200).json({

      message:
        "Lecture removed successfully",

    });

  } catch (error) {

    return res.status(500).json({

      message:
        `Remove lecture error ${error}`,

    });

  }

};


