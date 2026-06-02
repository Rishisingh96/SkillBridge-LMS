import Certificate from "../models/certificateModel.js";
import Module from "../models/moduleModel.js";
import Lecture from "../models/lectureModel.js";
import LectureProgress from "../models/lectureProgressModel.js";
import Course from "../models/courseModel.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";



// ======================================
// GENERATE CERTIFICATE
// ======================================
export const generateCertificate = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Check course
    const course =
      await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get modules
    const modules =
      await Module.find({
        course: courseId,
      });

    const moduleIds =
      modules.map(
        (module) => module._id
      );

    // Get lectures
    const lectures =
      await Lecture.find({
        module: {
          $in: moduleIds,
        },
      });

    const lectureIds =
      lectures.map(
        (lecture) => lecture._id
      );

    const totalLectures =
      lectureIds.length;

    // Completed lectures from LectureProgress
    const completedFromProgress =
      await LectureProgress.countDocuments({
        user: userId,
        lecture: {
          $in: lectureIds,
        },
        completed: true,
      });

    // Completed lectures from Lecture.isLectureCompleted field
    const completedFromLectureField =
      await Lecture.countDocuments({
        _id: {
          $in: lectureIds,
        },
        isLectureCompleted: true,
      });

    // Total completed lectures (take the higher count to be safe)
    const completedLectures = Math.max(completedFromProgress, completedFromLectureField);

    // Progress %
    const progressPercent =
      totalLectures > 0
        ? Math.round(
            (completedLectures /
              totalLectures) *
              100
          )
        : 0;

    // Eligibility
    if (progressPercent < 70) {
      return res.status(400).json({
        success: false,
        message:
          `Complete at least 70% of the course to unlock certificate. Current progress: ${progressPercent}%`,
      });
    }

    // Existing certificate
    let certificate =
      await Certificate.findOne({
        user: userId,
        course: courseId,
      });

    // Create certificate
    if (!certificate) {
      certificate =
        await Certificate.create({
          user: userId,
          course: courseId,
          progressPercent,

          certificateId:
            "CERT-" +
            crypto
              .randomBytes(4)
              .toString("hex")
              .toUpperCase(),
        });
    }

    return res.status(200).json({
      success: true,
      message:
        "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET CERTIFICATE
export const getCertificate = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params;

    const certificate =
      await Certificate.findOne({
        user: req.userId,
        course: courseId,
      })
        .populate(
          "user",
          "name email"
        )
        .populate(
          "course",
          "title thumbnail"
        );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message:
          "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// download Certificate
export const downloadCertificate = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params;

    const certificate =
      await Certificate.findOne({
        user: req.userId,
        course: courseId,
      })
        .populate("user", "name")
        .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
    });

    const filename = `${certificate.course.title}-certificate.pdf`;

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    // Set CORS headers explicitly for file download
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    doc.pipe(res);

    // Title
    doc
      .fontSize(30)
      .text(
        "Certificate of Completion",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    doc
      .fontSize(18)
      .text(
        "This is to certify that",
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(28)
      .text(
        certificate.user.name,
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(18)
      .text(
        `has successfully completed`,
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(24)
      .text(
        certificate.course.title,
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    doc
      .fontSize(14)
      .text(
        `Certificate ID: ${certificate.certificateId}`,
        {
          align: "center",
        }
      );

    doc.text(
      `Issued On: ${new Date(
        certificate.issuedAt
      ).toLocaleDateString()}`,
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

