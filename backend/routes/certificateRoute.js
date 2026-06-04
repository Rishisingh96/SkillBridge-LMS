import express from "express";
import {
  generateCertificate,
  getCertificate,
  downloadCertificate,
  getAllCertificates,
} from "../controller/certificateController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Generate certificate for a course
router.post(
  "/generate/:courseId",
  isAuth,
  generateCertificate
);

// Get certificate for a specific course
router.get(
  "/:courseId",
  isAuth,
  getCertificate
);

// Get all certificates for the logged-in user
router.get(
  "/",
  isAuth,
  getAllCertificates
);

// Download certificate PDF
router.get(
  "/download/:courseId",
  isAuth,
  downloadCertificate
);

export default router;
