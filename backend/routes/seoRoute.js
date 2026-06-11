import express from "express";
import { generateSitemap, generateRobotsTxt } from "../controller/seoController.js";

const router = express.Router();

// SEO Routes
router.get("/sitemap.xml", generateSitemap);
router.get("/robots.txt", generateRobotsTxt);

export default router;
