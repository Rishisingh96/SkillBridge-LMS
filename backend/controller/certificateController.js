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

// GET ALL CERTIFICATES FOR USER
export const getAllCertificates = async (
  req,
  res
) => {
  try {
    const certificates =
      await Certificate.find({
        user: req.userId,
      })
        .populate("course", "title thumbnail")
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      certificates,
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
    res.setHeader("Access-Control-Allow-Origin", "process.env.FRONTEND_URL");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    doc.pipe(res);

    // Page dimensions
    const width = doc.page.width;
    const height = doc.page.height;

    // Premium gradient background - elegant cream to light gold
    doc.fillColor('#FFFBF0')
       .rect(0, 0, width, height)
       .fill();

    // Triple decorative border for premium look
    const outerBorder = 15;
    const middleBorder = 22;
    const innerBorder = 28;

    // Outer border - dark gold
    doc.lineWidth(4)
       .strokeColor('#C9A227')
       .rect(outerBorder, outerBorder, width - outerBorder * 2, height - outerBorder * 2)
       .stroke();

    // Middle border - lighter gold
    doc.lineWidth(2)
       .strokeColor('#E8C547')
       .rect(middleBorder, middleBorder, width - middleBorder * 2, height - middleBorder * 2)
       .stroke();

    // Inner border - thin elegant line
    doc.lineWidth(1)
       .strokeColor('#D4AF37')
       .rect(innerBorder, innerBorder, width - innerBorder * 2, height - innerBorder * 2)
       .stroke();

    // Premium corner decorations with ornate design
    const cornerSize = 50;
    const cornerOffset = 35;

    // Top-left corner
    doc.lineWidth(2.5)
       .strokeColor('#C9A227')
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

    // Elegant decorative line below header
    doc.moveTo(width * 0.15, 115)
       .lineTo(width * 0.85, 115)
       .lineWidth(2)
       .strokeColor('#C9A227')
       .stroke();

    // Header - "Certificate of Completion" with premium styling
    doc.fontSize(38)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('Certificate of Completion', { align: 'center' });

    doc.moveDown(0.5);

    // Subtitle
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#555555')
       .text('This is to certify that', { align: 'center' });

    doc.moveDown(1);

    // Student name - elegant serif font
    doc.fontSize(32)
       .font('Times-Roman')
       .fillColor('#0a0a0a')
       .text(certificate.user.name, { align: 'center' });

    // Premium underline for name
    const nameWidth = doc.widthOfString(certificate.user.name);
    const nameX = (width - nameWidth) / 2;
    const nameY = doc.y - 3;
    doc.moveTo(nameX, nameY)
       .lineTo(nameX + nameWidth, nameY)
       .lineWidth(2)
       .strokeColor('#C9A227')
       .stroke();

    doc.moveDown(1.5);

    // Completion text
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#555555')
       .text('has successfully completed the course', { align: 'center' });

    doc.moveDown(1);

    // Course title - premium gold color
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#B8860B')
       .text(certificate.course.title, { align: 'center' });

    doc.moveDown(2);

    // Certificate details - compact layout
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#444444');

    // Certificate ID and date on same line
    const issueDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Certificate ID: ${certificate.certificateId}  |  Issued: ${issueDate}`, { align: 'center' });

    // Signature section - optimized spacing
    doc.moveDown(2.5);

    const signatureY = doc.y;
    const signatureWidth = width * 0.22;

    // Left signature - SkillBridge LMS
    doc.moveTo(width * 0.18, signatureY)
       .lineTo(width * 0.18 + signatureWidth, signatureY)
       .lineWidth(1.5)
       .strokeColor('#1a1a1a')
       .stroke();

    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('SkillBridge LMS', width * 0.18, signatureY + 5, { width: signatureWidth, align: 'center' });

    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Rishi singh', width * 0.18, signatureY + 18, { width: signatureWidth, align: 'center' });
      //  .text('Authorized Signature', width * 0.18, signatureY + 18, { width: signatureWidth, align: 'center' });

    // Right signature - Instructor
    doc.moveTo(width * 0.6, signatureY)
       .lineTo(width * 0.6 + signatureWidth, signatureY)
       .stroke();

    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('Instructor', width * 0.6, signatureY + 5, { width: signatureWidth, align: 'center' });

    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#666666')
       .text('Course Instructor', width * 0.6, signatureY + 18, { width: signatureWidth, align: 'center' });

    // Premium seal/badge - positioned optimally
    doc.moveDown(2);
    const sealX = width / 2;
    const sealY = doc.y;
    const sealRadius = 30;

    // Outer seal with gradient effect
    doc.circle(sealX, sealY, sealRadius)
       .lineWidth(3)
       .strokeColor('#C9A227')
       .fillColor('#FFFBF0')
       .fillAndStroke();

    // Middle seal ring
    doc.circle(sealX, sealY, sealRadius - 6)
       .lineWidth(1.5)
       .strokeColor('#E8C547')
       .stroke();

    // Inner seal
    doc.circle(sealX, sealY, sealRadius - 10)
       .lineWidth(1)
       .strokeColor('#D4AF37')
       .stroke();

    // Seal text
    doc.fontSize(7)
       .font('Helvetica-Bold')
       .fillColor('#B8860B')
       .text('OFFICIAL', sealX - 18, sealY - 4, { width: 36, align: 'center' });

    doc.fontSize(6)
       .font('Helvetica')
       .fillColor('#666666')
       .text('CERTIFICATE', sealX - 20, sealY + 4, { width: 40, align: 'center' });

    // Premium corner dots
    const dotRadius = 6;
    doc.circle(cornerOffset + 12, cornerOffset + 12, dotRadius)
       .lineWidth(1.5)
       .strokeColor('#C9A227')
       .fillColor('#FFFBF0')
       .fillAndStroke();

    doc.circle(width - cornerOffset - 12, cornerOffset + 12, dotRadius)
       .fillAndStroke();

    doc.circle(cornerOffset + 12, height - cornerOffset - 12, dotRadius)
       .fillAndStroke();

    doc.circle(width - cornerOffset - 12, height - cornerOffset - 12, dotRadius)
       .fillAndStroke();

    doc.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

