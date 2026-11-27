import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import Course from "../models/courseModel.js";
import Module from "../models/moduleModel.js";
import Lecture from "../models/lectureModel.js";
import LectureProgress from "../models/lectureProgressModel.js";

describe("📈 Phase 4: Progress Tracking, Resume Playback & Quizzes", () => {
  let studentToken;
  let studentId;
  let educatorToken;
  let educatorId;
  let testCourse;
  let testModule;
  let testLecture;

  beforeEach(async () => {
    // 1. Create Student
    const studentRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Progress Student",
        email: `prog_student_${Date.now()}@example.com`,
        password: "Password123#",
        role: "student",
      });
    studentToken = studentRes.body.token;
    studentId = studentRes.body.user._id;

    // 2. Create Educator
    const educatorRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Progress Educator",
        email: `prog_educator_${Date.now()}@example.com`,
        password: "Password123#",
        role: "educator",
      });
    educatorToken = educatorRes.body.token;
    educatorId = educatorRes.body.user._id;

    // 3. Create Course, Module, Lecture
    testCourse = await Course.create({
      title: "Python Data Science Bootcamp",
      category: "Data Science",
      price: 0,
      creator: educatorId,
      isPublished: true,
    });

    testModule = await Module.create({
      title: "Module 1: Pandas & NumPy",
      course: testCourse._id,
    });
    testCourse.modules.push(testModule._id);
    await testCourse.save();

    testLecture = await Lecture.create({
      lectureTitle: "Lecture 1: Intro to Pandas Dataframes",
      description: "Dataframe manipulation tutorial",
      module: testModule._id,
      video: {
        url: "https://example.com/video1.mp4",
        duration: 100, // 100 seconds
      },
    });
    testModule.lectures.push(testLecture._id);
    await testModule.save();
  });

  // ==========================================
  // PROGRESS TRACKING & AUTO-COMPLETION
  // ==========================================
  describe("POST /api/course/progress/update", () => {
    it("should record watched duration and calculate progress percent", async () => {
      const res = await request(app)
        .post("/api/course/progress/update")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          lectureId: testLecture._id.toString(),
          currentPosition: 50, // 50 seconds out of 100
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.progress.currentPosition).toBe(50);
      expect(res.body.progress.progressPercent).toBe(50);
      expect(res.body.progress.completed).toBe(false);
    });

    it("should automatically mark lecture as completed when watched >= 95%", async () => {
      const res = await request(app)
        .post("/api/course/progress/update")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          lectureId: testLecture._id.toString(),
          currentPosition: 96, // 96% of 100s
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.progress.completed).toBe(true);
      expect(res.body.progress.progressPercent).toBe(96);

      // Verify in DB
      const dbProgress = await LectureProgress.findOne({
        user: studentId,
        lecture: testLecture._id,
      });
      expect(dbProgress.completed).toBe(true);
    });
  });

  // ==========================================
  // RESUME PLAYBACK
  // ==========================================
  describe("GET /api/course/progress/resume/:courseId", () => {
    it("should return last watched lecture and position for seamless resume", async () => {
      // 1. Watch partially (35s)
      await request(app)
        .post("/api/course/progress/update")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          lectureId: testLecture._id.toString(),
          currentPosition: 35,
        });

      // 2. Fetch resume data
      const res = await request(app)
        .get(`/api/course/progress/resume/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.lecture).toBeDefined();
    });
  });

  // ==========================================
  // QUIZ ENGINE
  // ==========================================
  describe("Quiz Question Authoring & Student Assessment", () => {
    it("should allow educator to add a quiz question to a lecture", async () => {
      const res = await request(app)
        .post(`/api/course/add-quiz/${testLecture._id}`)
        .set("Authorization", `Bearer ${educatorToken}`)
        .send({
          question: "What is the primary data structure in Pandas?",
          options: ["Series", "DataFrame", "Tensor", "Array"],
          correctAnswer: "DataFrame",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Quiz added successfully");
      expect(res.body.quizQuestions.length).toBeGreaterThan(0);

      const dbLecture = await Lecture.findById(testLecture._id);
      expect(dbLecture.quizQuestions.length).toBeGreaterThan(0);
    });

    it("should reject quiz question with less than 2 options", async () => {
      const res = await request(app)
        .post(`/api/course/add-quiz/${testLecture._id}`)
        .set("Authorization", `Bearer ${educatorToken}`)
        .send({
          question: "Incomplete question?",
          options: ["Only One Option"],
          correctAnswer: "Only One Option",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Minimum 2 options are required");
    });

    it("should mark quiz completed for student on submission", async () => {
      const res = await request(app)
        .put(`/api/course/mark-quiz-completed/${testLecture._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify in DB
      const dbProgress = await LectureProgress.findOne({
        user: studentId,
        lecture: testLecture._id,
      });
      expect(dbProgress.isQuizCompleted).toBe(true);
    });
  });
});
