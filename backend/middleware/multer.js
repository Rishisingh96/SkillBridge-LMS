import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  // ==========================
  // DESTINATION
  // ==========================
  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },

  // ==========================
  // FILE NAME
  // ==========================
  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

const upload = multer({

  storage,

  // ==========================
  // FILE SIZE LIMIT
  // ==========================
  limits: {

    fileSize: 500 * 1024 * 1024,

  },

  // ==========================
  // FILE FILTER
  // ==========================
  fileFilter: (req, file, cb) => {

    // ==========================
    // ALLOWED MIME TYPES
    // ==========================
    const allowedMimeTypes = [

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

      // ==========================
      // PDF / DOCS
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
      // ZIP / RAR
      // ==========================
      "application/zip",

      "application/x-zip-compressed",

      "application/x-rar-compressed",

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

      // WEB
      ".html",
      ".css",
      ".scss",

      // CONFIG
      ".json",
      ".xml",
      ".yml",
      ".yaml",

      // DOCS
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".txt",
      ".xls",
      ".xlsx",

      // ZIP
      ".zip",
      ".rar",

    ];

    // ==========================
    // CHECK EXTENSION
    // ==========================
    const isExtensionAllowed =
      allowedExtensions.some((ext) =>
        file.originalname
          .toLowerCase()
          .endsWith(ext)
      );

    // ==========================
    // FINAL VALIDATION
    // ==========================
    if (

      allowedMimeTypes.includes(
        file.mimetype
      ) ||

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