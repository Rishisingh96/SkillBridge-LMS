import express from "express";
import { createCourse, deleteCourse, editCourse, getCourseById, getCreatorCourses, getPublishedCourses } from "../controller/courseController.js";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";

const courseRoute = express.Router();

courseRoute.post("/create", createCourse)
courseRoute.get("/getpublished", getPublishedCourses)
courseRoute.get("/getcreator", isAuth, getCreatorCourses)
courseRoute.put("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRoute.get("/getcourse/:courseId", getCourseById)
courseRoute.delete("/remove/:courseId", isAuth, deleteCourse)

export default courseRoute
