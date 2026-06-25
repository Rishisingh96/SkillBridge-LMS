import express, { Router } from "express";
import { createCourse, deleteCourse, editCourse, getCourseById, getCreatorById, getCreatorCourses, getPublishedCourses, togglePublishCourse, getAllCourses } from "../controller/courseController.js";
import upload from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";
import { createLecture, editLecture, getCourseLectures, removeLecture, removeLectureVideo, markLectureCompleted, markQuizCompleted } from "../controller/lectureController.js";
import { downloadResource, getLectureResources, removeResource, uploadLectureResource } from "../controller/uploadLectureResource.js";
import { addQuizQuestion, removeQuizQuestion, getLectureQuiz } from "../controller/quizController.js";
import { enrollCourse, checkEnrollmentStatus, getUserEnrollments } from "../controller/enrollMentController.js";
import { getCourseProgress, resumeLecture, updateLectureProgress } from "../controller/progressController.js";
import { createModule, getCourseModules, removeAllModules, removeModule } from "../controller/moduleController.js";
import { getDashboardStats, getRecentEnrollments } from "../controller/dashboardController.js";
import { addComment, addReply, getLectureComments, removeComment, removeReply, toggleCommentLike, togglePinComment, toggleReplyLike } from "../controller/commentController.js";
import { downloadCertificate, generateCertificate, getCertificate } from "../controller/certificateController.js";

const courseRoute = express.Router();


// course section
courseRoute.post("/create", isAuth, isRole("educator"), createCourse)
courseRoute.get("/getcreator", isAuth, isRole("educator"), getCreatorCourses)
courseRoute.put("/editcourse/:courseId", isAuth, isRole("educator"), upload.single("thumbnail"), editCourse)
courseRoute.get("/getcourse/:courseId", getCourseById)
courseRoute.delete("/remove/:courseId", isAuth, isRole("educator"), deleteCourse)



// Get user enrollments with validity
courseRoute.get("/user-enrollments", isAuth, getUserEnrollments);

courseRoute.get("/recent-enrollments", isAuth, isRole("educator"), getRecentEnrollments);



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
courseRoute.get("/course-modules/:courseId", getCourseModules);


//For lecture
// ──────────────────────────────────────────
courseRoute.post("/createlecture/:moduleId", isAuth, isRole("educator"), createLecture)
courseRoute.get("/courselecture/:moduleId", isAuth, isRole("educator"), getCourseLectures)
courseRoute.post("/editlecture/:lectureId", isAuth, isRole("educator"), upload.single("videoUrl"), editLecture)
courseRoute.delete("/removelecture/:lectureId", isAuth, isRole("educator"), removeLecture)
courseRoute.delete("/remove-lecture-video/:lectureId", isAuth, isRole("educator"), removeLectureVideo);
courseRoute.put("/mark-lecture-completed/:lectureId", isAuth, markLectureCompleted);
courseRoute.put("/mark-quiz-completed/:lectureId", isAuth, markQuizCompleted);


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
courseRoute.post("/progress/update", updateLectureProgress);

courseRoute.get(
  "/progress/course/:courseId",
  getCourseProgress
);

courseRoute.get(
  "/progress/resume/:courseId",
  resumeLecture
);


// Certificate 
courseRoute.post(
  "/certificate/generate/:courseId", isAuth,
  generateCertificate
);

courseRoute.get(
  "/certificate/:courseId",isAuth,
  getCertificate
);

courseRoute.get(
  "/certificate/download/:courseId",
  isAuth,
  downloadCertificate
);

// Handle OPTIONS for certificate download (CORS preflight)
courseRoute.options(
  "/certificate/download/:courseId",
  (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
  }
);

// Dashboard stats
// ──────────────────────────────────────────
courseRoute.get("/dashboard-stats", isAuth, getDashboardStats);




export default courseRoute
