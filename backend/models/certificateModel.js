import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    certificateId: {
      type: String,
      unique: true,
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
    // Cloudinary/S3 PDF URL
    pdfUrl: {
      type: String,
      default: null,
    },

    progressPercent: {
      type: Number,
      default: 100,
    },
    
  },
  {
    timestamps: true,
  }
);

certificateSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Certificate",
  certificateSchema
);