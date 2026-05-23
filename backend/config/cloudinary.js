import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {

  try {

    if (!filePath) return null;

    // =========================
    // FILE EXTENSION
    // =========================
    const ext = path.extname(filePath).toLowerCase();

    // =========================
    // PDF CHECK
    // =========================
    const isPdf = ext === ".pdf";

    // =========================
    // IMAGE / PDF
    // =========================
    const resourceType = isPdf
      ? "raw"
      : "auto";

    // =========================
    // UPLOAD
    // =========================
    const uploadResult =
      await cloudinary.uploader.upload(
        filePath, 
        {
          resource_type: resourceType,
          folder: "lecture-resources",
        }
      );

    // =========================
    // DELETE LOCAL FILE
    // =========================
    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    return {

      fileUrl:
        uploadResult.secure_url,

      publicId:
        uploadResult.public_id,

      resourceType:
        uploadResult.resource_type,

    };

  } catch (error) {

    console.log(
      "Cloudinary Upload Error:",
      error
    );

    if (
      filePath &&
      fs.existsSync(filePath)
    ) {

      fs.unlinkSync(filePath);

    }

    return null;

  }

};

export default uploadOnCloudinary;