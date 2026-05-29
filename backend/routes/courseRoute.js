import express, { Router } from "express";
import { createCourse, deleteCourse, editCourse, getCourseById, getCreatorById, getCreatorCourses, getPublishedCourses, togglePublishCourse, getAllCourses } from "../controller/courseController.js";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";
import { createLecture, editLecture, getCourseLectures, removeLecture, removeLectureVideo } from "../controller/lectureController.js";
import { downloadResource, getLectureResources, removeResource, uploadLectureResource } from "../controller/uploadLectureResource.js";
import { addQuizQuestion, removeQuizQuestion, getLectureQuiz } from "../controller/quizController.js";
import { enrollCourse, checkEnrollmentStatus, getUserEnrollments } from "../controller/enrollMentController.js";
import { getCourseProgress, resumeLecture, updateLectureProgress, updateWatchTime } from "../controller/progressController.js";
import { createModule, getCourseModules, removeAllModules, removeModule } from "../controller/moduleController.js";
import { getDashboardStats, getRecentEnrollments } from "../controller/dashboardController.js";
import { addComment, addReply, getLectureComments, removeComment, removeReply, toggleCommentLike, togglePinComment, toggleReplyLike } from "../controller/commentController.js";

const courseRoute = express.Router();


// course section
courseRoute.post("/create", isAuth, isRole("educator"), createCourse)
courseRoute.get("/getcreator", isAuth, isRole("educator"), getCreatorCourses)
courseRoute.put("/editcourse/:courseId", isAuth, isRole("educator"), upload.single("thumbnail"), editCourse)
courseRoute.get("/getcourse/:courseId", getCourseById)
courseRoute.delete("/remove/:courseId", isAuth, isRole("educator"), deleteCourse)

// only when free course for testing
courseRoute.post("/enroll/:courseId", isAuth, enrollCourse);

// Check enrollment status with validity
courseRoute.get("/check-enrollment/:courseId", isAuth, checkEnrollmentStatus);

// Get user enrollments with validity
courseRoute.get("/user-enrollments", isAuth, getUserEnrollments);

//published
// ──────────────────────────────────────────
courseRoute.get("/getpublished", getPublishedCourses)
courseRoute.get("/all-courses", isAuth, isRole("admin"), getAllCourses)
courseRoute.put("/publish/:courseId", isAuth, isRole("educator"), togglePublishCourse);
courseRoute.put("/unpublish/:courseId", isAuth, isRole("educator"), togglePublishCourse);


//Creator
courseRoute.post("/creator", isAuth, getCreatorById)


//Module create
// ──────────────────────────────────────────
courseRoute.post("/create-module/:courseId", isAuth, isRole("educator"), createModule);
courseRoute.delete("/remove-module/:moduleId", isAuth, isRole("educator"), removeModule);
courseRoute.delete("/remove-all-modules/:courseId", isAuth, isRole("educator"), removeAllModules);
courseRoute.get("/course-modules/:courseId", isAuth, getCourseModules);


//For lecture
// ──────────────────────────────────────────
courseRoute.post("/createlecture/:moduleId", isAuth, isRole("educator"), createLecture)
courseRoute.get("/courselecture/:moduleId", isAuth, isRole("educator"), getCourseLectures)
courseRoute.post("/editlecture/:lectureId", isAuth, isRole("educator"), upload.single("videoUrl"), editLecture)
courseRoute.delete("/removelecture/:lectureId", isAuth, isRole("educator"), removeLecture)
courseRoute.delete("/remove-lecture-video/:lectureId", isAuth, isRole("educator"), removeLectureVideo);


// upload resourse , download resourse, edite , remove
// ──────────────────────────────────────────
courseRoute.post("/upload-resource/:lectureId", isAuth, isRole("educator"), upload.array("files", 20),uploadLectureResource);
courseRoute.delete("/removeresource/:lectureId/:resourceId", isAuth, isRole("educator"), removeResource)
courseRoute.get("/download-resource/:lectureId/:resourceId", isAuth, downloadResource);
courseRoute.get("/lecture-resources/:lectureId", isAuth, getLectureResources);


//Quiz section , edit, remove, get
// ──────────────────────────────────────────
courseRoute.post("/add-quiz/:lectureId", isAuth, isRole("educator"), addQuizQuestion);
courseRoute.delete("/remove-quiz/:lectureId/:quizId", isAuth, isRole("educator"), removeQuizQuestion);
courseRoute.get("/get-quiz/:lectureId", isAuth, getLectureQuiz);


// ── COMMENT ROUTES ──────────────────────────────────────────

// Core
courseRoute.post("/comment/:lectureId", isAuth, addComment);           // Comment karo
courseRoute.delete("/comment/:lectureId/:commentId", isAuth, removeComment);  // Comment hatao
courseRoute.get("/comment/:lectureId", isAuth, getLectureComments);    // Sab comments dekho

// Replies
courseRoute.post("/comment/reply/:lectureId/:commentId", isAuth, addReply);          // Reply karo
courseRoute.delete("/comment/reply/:lectureId/:commentId/:replyId", isAuth, removeReply); // Reply hatao

// Likes
courseRoute.put("/comment/like/:lectureId/:commentId", isAuth, toggleCommentLike);   // Comment like/unlike
courseRoute.put("/comment/reply/like/:lectureId/:commentId/:replyId", isAuth, toggleReplyLike); // Reply like/unlike

// Educator Only
courseRoute.put("/comment/pin/:lectureId/:commentId", isAuth, togglePinComment);     // Comment pin karo


// Progress report 
// ──────────────────────────────────────────
courseRoute.post("/update", updateLectureProgress);
courseRoute.get("/course/:courseId/:userId", getCourseProgress);
courseRoute.get("/resume/:userId/:courseId", resumeLecture);
courseRoute.post("/watchtime", updateWatchTime);

// Dashboard stats
// ──────────────────────────────────────────
courseRoute.get("/dashboard-stats", isAuth, getDashboardStats);
courseRoute.get("/recent-enrollments", isAuth, isRole("educator"), getRecentEnrollments);


export default courseRoute
