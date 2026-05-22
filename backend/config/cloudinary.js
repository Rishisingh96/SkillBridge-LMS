import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File Function
const uploadOnCloudinary = async (
  filePath
) => {

  try {

    if (!filePath) return null;

    // ==========================
    // DETECT PDF
    // ==========================
    const isPdf =
      filePath
        .toLowerCase()
        .endsWith(".pdf");

    console.log("Cloudinary Upload - File Path:", filePath);
    console.log("Cloudinary Upload - Is PDF:", isPdf);

    // ==========================
    // UPLOAD
    // ==========================
    const uploadResult =
      await cloudinary.uploader.upload(
        filePath,
        {

          resource_type: "raw",

          folder:
            "lecture-resources",

          // For PDFs, ensure proper delivery
          use_filename: true,
          unique_filename: false,
          overwrite: true,

        }
      );

    // ==========================
    // DELETE LOCAL FILE
    // ==========================
    if (
      fs.existsSync(filePath)
    ) {

      fs.unlinkSync(filePath);

    }

    // ==========================
    // RETURN DATA
    // ==========================
    // For PDFs, add fl_attachment to force download
    const fileUrl = isPdf
      ? `${uploadResult.secure_url}?fl_attachment`
      : uploadResult.secure_url;

    return {

      fileUrl,

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

    // delete local file
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