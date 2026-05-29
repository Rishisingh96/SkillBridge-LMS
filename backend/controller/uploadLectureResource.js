// Import Models
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import User from "../models/userModel.js";
import Module from "../models/moduleModel.js";

// Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { isCourseActive } from "../utils/isCourseActive.js";


// Upload Lecture Resources
export const uploadLectureResource = async (req, res) => {

  try {

    const { lectureId } = req.params;

    // Find Lecture
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {

      return res.status(404).json({
        message: "Lecture not found",
      });

    }

    // Check Files
    if (!req.files || req.files.length === 0) {

      return res.status(400).json({
        message: "No files uploaded",
      });

    }

    // Store Uploaded Resources
    const uploadedResources = [];

    // Loop Multiple Files
    for (const file of req.files) {

      console.log(
        "Uploading File:",
        file.originalname
      );

      // Upload To Cloudinary
      const uploadedFile =
        await uploadOnCloudinary(file.path);

      console.log(
        "Uploaded File:",
        uploadedFile
      );

      // If Upload Failed
      if (!uploadedFile) {
        continue;
      }

      // Detect File Type
      let fileType = "doc";

      // PDF
      if (
        file.mimetype.includes("pdf")
      ) {

        fileType = "pdf";

      }

      // Image
      else if (
        file.mimetype.includes("image")
      ) {

        fileType = "image";

      }

      // ZIP / RAR
      else if (

        file.originalname
          .toLowerCase()
          .endsWith(".zip") ||

        file.originalname
          .toLowerCase()
          .endsWith(".rar")

      ) {

        fileType = "zip";

      }

      uploadedResources.push({

        title: file.originalname,

        fileUrl: uploadedFile.fileUrl,

        publicId: uploadedFile.publicId,

        resourceType:
          uploadedFile.resourceType,

        fileType,

        downloads: 0,

      });

    }

    // Save Resources In Lecture
    lecture.resources.push(
      ...uploadedResources
    );

    await lecture.save();

    // Final Response - return saved resources with _id
    return res.status(200).json({

      message:
        "Resources uploaded successfully",

      resources: lecture.resources,

      lecture,

    });

  } catch (error) {

    console.log(
      "Upload Resource Error:",
      error
    );

    return res.status(500).json({

      message:
        `Upload resource error ${error.message}`,

    });

  }

};

// Download Lecture Resource Controller
export const downloadResource = async (
  req,
  res
) => {

  try {

    const {
      lectureId,
      resourceId,
    } = req.params;

    const userId =
      req.userId;

    // =========================
    // FIND LECTURE
    // =========================
    const lecture =
      await Lecture.findById(
        lectureId
      );

    if (!lecture) {

      return res.status(404).json({

        success: false,

        message:
          "Lecture not found",

      });

    }

    // =========================
    // FIND RESOURCE
    // =========================
    const resource =
      lecture.resources.id(
        resourceId
      );

    if (!resource) {

      return res.status(404).json({

        success: false,

        message:
          "Resource not found",

      });

    }

    // =========================
    // FIND MODULE
    // =========================
    const module =
      await Module.findOne({
        lectures: lectureId,
      });

    if (!module) {

      return res.status(404).json({

        success: false,

        message:
          "Module not found",

      });

    }

    // =========================
    // FIND COURSE
    // =========================
    const course =
      await Course.findById(
        module.course
      );

    if (!course) {

      return res.status(404).json({

        success: false,

        message:
          "Course not found",

      });

    }

    // =========================
    // CHECK CREATOR
    // =========================
    const isCreator =
      course.creator.toString()
      === userId;

    // =========================
    // ACCESS CHECK - REMOVED ENROLLMENT RESTRICTION
    // =========================
    // Anyone can download resources now - no enrollment required

    // =========================
    // INCREASE DOWNLOAD COUNT
    // =========================
    resource.downloads += 1;

    // =========================
    // SAVE DOWNLOAD LOG
    // =========================
    resource.downloadLogs.push({

      userId,

      downloadedAt:
        new Date(),

    });

    // =========================
    // SAVE CHANGES
    // =========================
    await lecture.save();

    // =========================
    // GENERATE DOWNLOAD URL
    // =========================
    let downloadUrl =
      resource.fileUrl;

    // remove old query params
    downloadUrl =
      downloadUrl.split("?")[0];

    // force download
    downloadUrl =
      `${downloadUrl}?fl_attachment`;

    // =========================
    // FINAL RESPONSE
    // =========================
    return res.status(200).json({

      success: true,

      message:
        "Resource downloaded successfully",

      fileUrl:
        downloadUrl,

      downloads:
        resource.downloads,

    });

  } catch (error) {

    console.log(
      "Download Resource Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        `Download resource error ${error.message}`,

    });

  }

};

// Delete Lecture Resource
export const removeResource = async (
  req,
  res
) => {

  try {

    const {
      lectureId,
      resourceId,
    } = req.params;

    // Find Lecture
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

    // Find Resource
    const resource =
      lecture.resources.id(
        resourceId
      );

    if (!resource) {

      return res.status(404).json({

        message:
          "Resource not found",

      });

    }

    await cloudinary.uploader.destroy(
  resource.publicId,
  {
    resource_type:
      resource.resourceType || "image",
    invalidate: true,
  }
);

    // Remove Resource From MongoDB
    lecture.resources.pull(
      resourceId
    );

    // Save Lecture
    await lecture.save();

    return res.status(200).json({

      message:
        "Resource removed successfully",

      lecture,

    });

  } catch (error) {

    console.log(
      "Remove Resource Error:",
      error
    );

    return res.status(500).json({

      message:
        `Remove resource error ${error.message}`,

    });

  }

};


//Get Resourse 
export const getLectureResources = async (
  req,
  res
) => {

  try {

    const { lectureId } =
      req.params;

    const lecture =
      await Lecture.findById(
        lectureId
      ).select("resources");

    if (!lecture) {

      return res.status(404).json({

        message:
          "Lecture not found",

      });

    }

    return res.status(200).json({

      resources:
        lecture.resources,

    });

  } catch (error) {

    return res.status(500).json({

      message:
        `Get resources error ${error.message}`,

    });

  }

};



