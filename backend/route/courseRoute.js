import express, { Router } from "express";
import { createCourse, deleteCourse, editCourse, getCourseById, getCreatorById, getCreatorCourses, getPublishedCourses, togglePublishCourse } from "../controller/courseController.js";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import { createLecture, editLecture, getCourseLectures, removeLecture, removeLectureVideo } from "../controller/lectureController.js";
import { downloadResource, getLectureResources, removeResource, uploadLectureResource } from "../controller/uploadLectureResource.js";
import { addQuizQuestion, removeQuizQuestion } from "../controller/quizController.js";
import { enrollCourse, checkEnrollmentStatus } from "../controller/enrollMentController.js";
import { getCourseProgress, resumeLecture, updateLectureProgress, updateWatchTime } from "../controller/progressController.js";
import { createModule, getCourseModules, removeAllModules, removeModule } from "../controller/moduleController.js";

const courseRoute = express.Router();


// course section
courseRoute.post("/create", isAuth, createCourse)
courseRoute.get("/getcreator", isAuth, getCreatorCourses)
courseRoute.put("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRoute.get("/getcourse/:courseId", getCourseById)
courseRoute.delete("/remove/:courseId", isAuth, deleteCourse)

// only when free course for testing
courseRoute.post("/enroll/:courseId", isAuth, enrollCourse);

// Check enrollment status with validity
courseRoute.get("/check-enrollment/:courseId", isAuth, checkEnrollmentStatus);

//published
courseRoute.get("/getpublished", getPublishedCourses)
courseRoute.put("/publish/:courseId", isAuth, togglePublishCourse);
courseRoute.put("/unpublish/:courseId", isAuth, togglePublishCourse);


//Creator
courseRoute.post("/creator", isAuth, getCreatorById)


//Module create 
courseRoute.post("/create-module/:courseId", isAuth, createModule);

courseRoute.delete("/remove-module/:moduleId", isAuth, removeModule);

courseRoute.delete("/remove-all-modules/:courseId", isAuth, removeAllModules);

courseRoute.get("/course-modules/:courseId", isAuth, getCourseModules);


//For lecture
courseRoute.post("/createlecture/:moduleId", isAuth, createLecture)
courseRoute.get("/courselecture/:moduleId", isAuth, getCourseLectures)

courseRoute.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture)
courseRoute.delete("/removelecture/:lectureId", isAuth, removeLecture)
courseRoute.delete("/remove-lecture-video/:lectureId", isAuth, removeLectureVideo);


// upload resourse , download resourse, edite , remove 
courseRoute.post("/upload-resource/:lectureId", isAuth, upload.array("files", 20),uploadLectureResource);

courseRoute.delete("/removeresource/:lectureId/:resourceId", isAuth, removeResource)
courseRoute.get("/download-resource/:lectureId/:resourceId", isAuth,  downloadResource);
courseRoute.get("/lecture-resources/:lectureId", isAuth, getLectureResources);


//Quiz section , edit, remove
courseRoute.post("/add-quiz/:lectureId", addQuizQuestion);
courseRoute.delete("/remove-quiz/:lectureId/:quizId", isAuth, removeQuizQuestion);


// Progress report 
courseRoute.post("/update", updateLectureProgress);
courseRoute.get("/course/:courseId/:userId", getCourseProgress);
courseRoute.get("/resume/:userId/:courseId", resumeLecture);
courseRoute.post("/watchtime", updateWatchTime);

export default courseRoute
