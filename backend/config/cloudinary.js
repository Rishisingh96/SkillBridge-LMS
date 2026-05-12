import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

const uploadOnClodinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!filePath) {
      return null;
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    }); // file can be video or image resource type auto

    // Delete the local file after successful upload
    fs.unlinkSync(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export default uploadOnClodinary;
