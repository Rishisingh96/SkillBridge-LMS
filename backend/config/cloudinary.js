import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File Function
const uploadOnCloudinary = async (filePath) => {

  try {

    // Check File
    if (!filePath) return null;

    // Upload File
    const uploadResult =
      await cloudinary.uploader.upload(
        filePath,
        {
          resource_type: "auto",
        }
      );

    // Delete Local File
    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    // Return Uploaded Data
    return {

      fileUrl: uploadResult.secure_url,

      publicId: uploadResult.public_id,

      resourceType:
        uploadResult.resource_type,

    };

  } catch (error) {

    console.log(
      "Cloudinary Upload Error:",
      error
    );

    // Delete Local File On Error
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