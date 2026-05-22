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

    // ==========================
    // ALL ALLOWED FILE TYPES
    // ==========================

    const allowedTypes = [

      // ==========================
      // IMAGES
      // ==========================

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

      // ==========================
      // VIDEOS
      // ==========================

      "video/mp4",
      "video/webm",
      "video/mkv",
      "video/x-matroska",
      "video/quicktime",
      "video/x-msvideo",
      "video/mpeg",
      "video/3gpp",
      "video/ogg",
      "video/ts",
      "video/mp2t",

      // ==========================
      // PDF / DOCS / NOTES
      // ==========================

      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-powerpoint",

      "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "text/plain",

      // ==========================
      // ZIP / SOURCE CODE FILES
      // ==========================

      "application/zip",

      "application/x-zip-compressed",

      "application/x-rar-compressed",

      "application/octet-stream",

      // ==========================
      // JAVASCRIPT
      // ==========================

      "application/javascript",

      "text/javascript",

      // ==========================
      // JSON
      // ==========================

      "application/json",

      // ==========================
      // XML
      // ==========================

      "application/xml",

      "text/xml",

      // ==========================
      // PYTHON
      // ==========================

      "text/x-python",

      // ==========================
      // JAVA
      // ==========================

      "text/x-java-source",

      // ==========================
      // C / CPP
      // ==========================

      "text/x-c",

      "text/x-c++",

      // ==========================
      // HTML / CSS
      // ==========================

      "text/html",

      "text/css",

      // ==========================
      // TYPESCRIPT
      // ==========================

      "application/typescript",

      // ==========================
      // YAML
      // ==========================

      "application/x-yaml",

      "text/yaml",

    ];

    // ==========================
    // FILE EXTENSIONS
    // ==========================

    const allowedExtensions = [

      // CODE FILES
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".java",
      ".py",
      ".cpp",
      ".c",
      ".cs",
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".go",
      ".dart",

      // FLUTTER
      ".dart",

      // REACT / NEXT
      ".jsx",
      ".tsx",

      // WEB FILES
      ".html",
      ".css",
      ".scss",

      // CONFIG
      ".json",
      ".env",
      ".xml",
      ".yml",
      ".yaml",

      // NOTES
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".txt",

      // SOURCE CODE ZIP
      ".zip",
      ".rar",
    ];

    // ==========================
    // CHECK EXTENSION
    // ==========================

    const isExtensionAllowed = allowedExtensions.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext)
    );

    // ==========================
    // FINAL VALIDATION
    // ==========================

    if (
      allowedTypes.includes(file.mimetype) ||
      isExtensionAllowed
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "File type not supported"
        ),
        false
      );

    }
  },
});

export default upload;