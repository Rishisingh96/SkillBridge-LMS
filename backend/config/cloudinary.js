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
    // HLS CHECK
    // =========================
    const isHls = ext === ".m3u8";

    // =========================
    // IMAGE / PDF / HLS
    // =========================
    let resourceType = "auto";
    let folder = "lecture-resources";

    if (isPdf) {
      resourceType = "raw";
    } else if (isHls) {
      resourceType = "video";
      folder = "lecture-videos";
    }

    // =========================
    // UPLOAD
    // =========================
    const uploadResult =
      await cloudinary.uploader.upload(
        filePath,
        {
          resource_type: resourceType,
          folder: folder,
          chunk_size: 6000000,
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