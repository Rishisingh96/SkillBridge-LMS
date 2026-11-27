import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import Course from "../models/courseModel.js";
import Module from "../models/moduleModel.js";
import Lecture from "../models/lectureModel.js";
import Review from "../models/reviewModel.js";
import Chat from "../models/chatboatModel.js";

describe("💬 Phase 6: Discussions, Reviews & AI Tutor", () => {
  let student1Token;
  let student1Id;
  let student2Token;
  let testCourse;
  let testLecture;

  beforeEach(async () => {
    // 1. Create Student 1
    const s1Res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Community Student 1",
        email: `comm_student1_${Date.now()}@example.com`,
        password: "Password123#",
        role: "student",
      });
    student1Token = s1Res.body.token;
    student1Id = s1Res.body.user._id;

    // 2. Create Student 2
    const s2Res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Community Student 2",
        email: `comm_student2_${Date.now()}@example.com`,
        password: "Password123#",
        role: "student",
      });
    student2Token = s2Res.body.token;

    // 3. Create Course & Lecture
    testCourse = await Course.create({
      title: "Fullstack Next.js Architecture",
      category: "Web Development",
      price: 0,
      creator: student1Id,
      isPublished: true,
    });

    const module = await Module.create({
      title: "Module 1",
      course: testCourse._id,
    });

    testLecture = await Lecture.create({
      lectureTitle: "Lecture 1: Server Components",
      description: "RSC paradigm in Next.js",
      module: module._id,
      video: { duration: 180 },
    });
  });

  // ==========================================
  // LECTURE COMMENTS & DISCUSSION THREADS
  // ==========================================
  describe("Lecture Comments & Replies", () => {
    it("should allow a student to post a comment on a lecture", async () => {
      const res = await request(app)
        .post(`/api/course/comment/${testLecture._id}`)
        .set("Authorization", `Bearer ${student1Token}`)
        .send({
          message: "Great explanation of Server Components!",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.comment.message).toBe("Great explanation of Server Components!");

      // Verify in DB
      const dbLecture = await Lecture.findById(testLecture._id);
      expect(dbLecture.comments.length).toBe(1);
    });

    it("should reject empty comment submission with 400", async () => {
      const res = await request(app)
        .post(`/api/course/comment/${testLecture._id}`)
        .set("Authorization", `Bearer ${student1Token}`)
        .send({ message: "" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Message is required");
    });

    it("should allow another student to add a nested reply to a comment", async () => {
      // 1. Post initial comment
      const commentRes = await request(app)
        .post(`/api/course/comment/${testLecture._id}`)
        .set("Authorization", `Bearer ${student1Token}`)
        .send({ message: "Does this support caching?" });

      const commentId = commentRes.body.comment._id;

      // 2. Student 2 replies
      const replyRes = await request(app)
        .post(`/api/course/comment/reply/${testLecture._id}/${commentId}`)
        .set("Authorization", `Bearer ${student2Token}`)
        .send({ message: "Yes, Next.js caches fetch requests by default." });

      expect(replyRes.status).toBe(201);
      expect(replyRes.body.success).toBe(true);
    });

    it("should toggle like on a comment", async () => {
      const commentRes = await request(app)
        .post(`/api/course/comment/${testLecture._id}`)
        .set("Authorization", `Bearer ${student1Token}`)
        .send({ message: "Helpful video!" });

      const commentId = commentRes.body.comment._id;

      // Like comment
      const likeRes = await request(app)
        .put(`/api/course/comment/like/${testLecture._id}/${commentId}`)
        .set("Authorization", `Bearer ${student2Token}`);

      expect(likeRes.status).toBe(200);
      expect(likeRes.body.success).toBe(true);
    });
  });

  // ==========================================
  // COURSE REVIEWS & RATINGS
  // ==========================================
  describe("POST & GET /api/review", () => {
    it("should allow user to submit a 5-star course review", async () => {
      const res = await request(app)
        .post("/api/review/createreview")
        .set("Authorization", `Bearer ${student1Token}`)
        .send({
          courseId: testCourse._id.toString(),
          rating: 5,
          comment: "Best Next.js course ever!",
        });

      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(5);

      // Verify in DB
      const dbReview = await Review.findOne({
        course: testCourse._id,
        user: student1Id,
      });
      expect(dbReview).not.toBeNull();
    });

    it("should prevent duplicate reviews by the same user for the same course", async () => {
      // First review
      await request(app)
        .post("/api/review/createreview")
        .set("Authorization", `Bearer ${student1Token}`)
        .send({
          courseId: testCourse._id.toString(),
          rating: 5,
          comment: "First review",
        });

      // Second review attempt
      const res = await request(app)
        .post("/api/review/createreview")
        .set("Authorization", `Bearer ${student1Token}`)
        .send({
          courseId: testCourse._id.toString(),
          rating: 4,
          comment: "Trying to review again",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already reviewed");
    });
  });

  // ==========================================
  // AI CHATBOT & TUTOR ASSISTANT
  // ==========================================
  describe("AI Chatbot Routes", () => {
    it("should reject chat request when required parameters are missing", async () => {
      const res = await request(app)
        .post("/api/chatbot/chat")
        .set("Authorization", `Bearer ${student1Token}`)
        .send({ message: "What is React?" }); // Missing lectureId

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Message and lectureId are required");
    });

    it("should allow student to save a chat conversation to history", async () => {
      const res = await request(app)
        .post("/api/chatbot/save")
        .set("Authorization", `Bearer ${student1Token}`)
        .send({
          lectureId: testLecture._id.toString(),
          lectureTitle: testLecture.lectureTitle,
          messages: [
            { role: "user", content: "What is RSC?" },
            { role: "assistant", content: "React Server Components run only on server." },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      // Verify chat saved in DB
      const dbChat = await Chat.findOne({ userId: student1Id });
      expect(dbChat).not.toBeNull();
    });
  });
});
