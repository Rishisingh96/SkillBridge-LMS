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

    // Page dimensions
    const width = doc.page.width;
    const height = doc.page.height;

    // Background color - cream/off-white for professional look
    doc.fillColor('#FFF9E6')
       .rect(0, 0, width, height)
       .fill();

    // Decorative border - outer gold border
    const borderWidth = 20;
    doc.lineWidth(3)
       .strokeColor('#D4AF37') // Gold color
       .rect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2)
       .stroke();

    // Inner decorative border
    const innerBorderWidth = 30;
    doc.lineWidth(1)
       .strokeColor('#B8860B') // Darker gold
       .rect(innerBorderWidth, innerBorderWidth, width - innerBorderWidth * 2, height - innerBorderWidth * 2)
       .stroke();

    // Corner decorations
    const cornerSize = 60;
    const cornerOffset = 40;

    // Top-left corner
    doc.lineWidth(2)
       .strokeColor('#D4AF37')
       .moveTo(cornerOffset, cornerOffset + cornerSize)
       .lineTo(cornerOffset, cornerOffset)
       .lineTo(cornerOffset + cornerSize, cornerOffset)
       .stroke();

    // Top-right corner
    doc.moveTo(width - cornerOffset - cornerSize, cornerOffset)
       .lineTo(width - cornerOffset, cornerOffset)
       .lineTo(width - cornerOffset, cornerOffset + cornerSize)
       .stroke();

    // Bottom-left corner
    doc.moveTo(cornerOffset, height - cornerOffset - cornerSize)
       .lineTo(cornerOffset, height - cornerOffset)
       .lineTo(cornerOffset + cornerSize, height - cornerOffset)
       .stroke();

    // Bottom-right corner
    doc.moveTo(width - cornerOffset - cornerSize, height - cornerOffset)
       .lineTo(width - cornerOffset, height - cornerOffset)
       .lineTo(width - cornerOffset, height - cornerOffset - cornerSize)
       .stroke();

    // Decorative line below header
    doc.moveTo(width * 0.2, 130)
       .lineTo(width * 0.8, 130)
       .lineWidth(2)
       .strokeColor('#D4AF37')
       .stroke();

    // Header - "Certificate of Completion"
    doc.fontSize(42)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('Certificate of Completion', { align: 'center' });

    doc.moveDown(1);

    // Subtitle with decorative styling
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#666666')
       .text('This is to certify that', { align: 'center' });

    doc.moveDown(1.5);

    // Student name - prominent display
    doc.fontSize(36)
       .font('Times-Roman')
       .fillColor('#1a1a1a')
       .text(certificate.user.name, { align: 'center' });

    // Underline for name
    const nameWidth = doc.widthOfString(certificate.user.name);
    const nameX = (width - nameWidth) / 2;
    const nameY = doc.y - 5;
    doc.moveTo(nameX, nameY)
       .lineTo(nameX + nameWidth, nameY)
       .lineWidth(1)
       .strokeColor('#D4AF37')
       .stroke();

    doc.moveDown(2);

    // Completion text
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#666666')
       .text('has successfully completed the course', { align: 'center' });

    doc.moveDown(1.5);

    // Course title - highlighted
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#B8860B')
       .text(certificate.course.title, { align: 'center' });

    doc.moveDown(3);

    // Certificate details section
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#444444');

    // Certificate ID with styling
    doc.text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' });

    doc.moveDown(0.5);

    // Issued date
    const issueDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Issued On: ${issueDate}`, { align: 'center' });

    // Signature section
    doc.moveDown(4);

    const signatureY = doc.y;
    const signatureWidth = width * 0.25;

    // Left signature line
    doc.moveTo(width * 0.2, signatureY)
       .lineTo(width * 0.2 + signatureWidth, signatureY)
       .lineWidth(1)
       .strokeColor('#1a1a1a')
       .stroke();

    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('SkillBridge LMS', width * 0.2, signatureY + 5, { width: signatureWidth, align: 'center' });

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Authorized Signature', width * 0.2, signatureY + 20, { width: signatureWidth, align: 'center' });

    // Right signature line
    doc.moveTo(width * 0.55, signatureY)
       .lineTo(width * 0.55 + signatureWidth, signatureY)
       .stroke();

    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('Instructor', width * 0.55, signatureY + 5, { width: signatureWidth, align: 'center' });

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Course Instructor', width * 0.55, signatureY + 20, { width: signatureWidth, align: 'center' });

    // Seal/Badge at bottom center
    doc.moveDown(3);
    const sealX = width / 2;
    const sealY = doc.y;
    const sealRadius = 35;

    // Outer seal circle
    doc.circle(sealX, sealY, sealRadius)
       .lineWidth(2)
       .strokeColor('#D4AF37')
       .fillColor('#FFF9E6')
       .fillAndStroke();

    // Inner seal circle
    doc.circle(sealX, sealY, sealRadius - 8)
       .lineWidth(1)
       .strokeColor('#B8860B')
       .stroke();

    // Seal text
    doc.fontSize(8)
       .font('Helvetica-Bold')
       .fillColor('#B8860B')
       .text('OFFICIAL', sealX - 20, sealY - 5, { width: 40, align: 'center' });

    doc.fontSize(7)
       .font('Helvetica')
       .fillColor('#666666')
       .text('CERTIFICATE', sealX - 22, sealY + 5, { width: 44, align: 'center' });

    // Decorative elements - small circles in corners
    const smallCircleRadius = 8;
    doc.circle(cornerOffset + 15, cornerOffset + 15, smallCircleRadius)
       .lineWidth(1)
       .strokeColor('#D4AF37')
       .stroke();

    doc.circle(width - cornerOffset - 15, cornerOffset + 15, smallCircleRadius)
       .stroke();

    doc.circle(cornerOffset + 15, height - cornerOffset - 15, smallCircleRadius)
       .stroke();

    doc.circle(width - cornerOffset - 15, height - cornerOffset - 15, smallCircleRadius)
       .stroke();

    doc.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

