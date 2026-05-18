import express from "express";
import { createCourse, deleteCourse, editCourse, getCourseById, getCreatorById, getCreatorCourses, getPublishedCourses } from "../controller/courseController.js";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import { createLecture, editLecture, getCourseLectures, removeLecture } from "../controller/lectureController.js";

const courseRoute = express.Router();

courseRoute.post("/create", isAuth, createCourse)
courseRoute.get("/getpublished", getPublishedCourses)
courseRoute.get("/getcreator", isAuth, getCreatorCourses)
courseRoute.put("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRoute.get("/getcourse/:courseId", getCourseById)
courseRoute.delete("/remove/:courseId", isAuth, deleteCourse)

//For lecture
courseRoute.post("/createlecture/:courseId", isAuth, createLecture)
courseRoute.get("/courselecture/:courseId", isAuth, getCourseLectures)
courseRoute.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture)
courseRoute.delete("/removelecture/:lectureId", isAuth, removeLecture)

//Creator
courseRoute.post("/creator", isAuth, getCreatorById)

export default courseRoute
