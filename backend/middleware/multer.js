import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,

  // 500MB Limit
  limits: {
    fileSize: 500 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    // All Allowed Image + Video Types
    const allowedTypes = [

      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
      "image/bmp",
      "image/tiff",
      "image/x-icon",

      // Videos
      "video/mp4",
      "video/webm",
      "video/mkv",
      "video/x-matroska",
      "video/quicktime", // mov
      "video/x-msvideo", // avi
      "video/mpeg",
      "video/3gpp",
      "video/ogg",
      "video/ts",
      // TS Video Files
      "video/mp2t",

    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only Image and Video files are allowed"
        ),
        false
      );
    }
  },
});

export default upload;