import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import Course from "../models/courseModel.js";
import Module from "../models/moduleModel.js";
import Lecture from "../models/lectureModel.js";
import LectureProgress from "../models/lectureProgressModel.js";
import Certificate from "../models/certificateModel.js";

describe("📜 Phase 5: Automated PDF Certificate Engine", () => {
  let studentToken;
  let studentId;
  let educatorId;
  let testCourse;
  let testModule;
  let lecture1;
  let lecture2;

  beforeEach(async () => {
    // 1. Create Student
    const studentRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Certificate Student",
        email: `cert_student_${Date.now()}@example.com`,
        password: "Password123#",
        role: "student",
      });
    studentToken = studentRes.body.token;
    studentId = studentRes.body.user._id;

    // 2. Create Educator
    const educatorRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Cert Educator",
        email: `cert_edu_${Date.now()}@example.com`,
        password: "Password123#",
        role: "educator",
      });
    educatorId = educatorRes.body.user._id;

    // 3. Create Course with 2 lectures
    testCourse = await Course.create({
      title: "Advanced TypeScript & Design Patterns",
      category: "Programming",
      price: 0,
      creator: educatorId,
      isPublished: true,
    });

    testModule = await Module.create({
      title: "Module 1: Generics & Utility Types",
      course: testCourse._id,
    });
    testCourse.modules.push(testModule._id);
    await testCourse.save();

    lecture1 = await Lecture.create({
      lectureTitle: "Lecture 1: Conditional Types",
      description: "Deep dive into TypeScript conditional types",
      module: testModule._id,
      video: { duration: 120 },
    });

    lecture2 = await Lecture.create({
      lectureTitle: "Lecture 2: Template Literal Types",
      description: "Advanced type gymnastics",
      module: testModule._id,
      video: { duration: 150 },
    });

    testModule.lectures.push(lecture1._id, lecture2._id);
    await testModule.save();
  });

  // ==========================================
  // ELIGIBILITY GATES
  // ==========================================
  describe("POST /api/certificate/generate/:courseId", () => {
    it("should reject certificate request when student has 0% progress", async () => {
      const res = await request(app)
        .post(`/api/certificate/generate/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Complete at least 70% of the course");
    });

    it("should reject certificate when student progress is only 50% (1 of 2 lectures)", async () => {
      // Mark only 1 lecture as completed
      await LectureProgress.create({
        user: studentId,
        lecture: lecture1._id,
        completed: true,
      });

      const res = await request(app)
        .post(`/api/certificate/generate/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Current progress: 50%");
    });

    it("should successfully generate certificate when progress is 100%", async () => {
      // Mark both lectures as completed
      await LectureProgress.create({
        user: studentId,
        lecture: lecture1._id,
        completed: true,
      });
      await LectureProgress.create({
        user: studentId,
        lecture: lecture2._id,
        completed: true,
      });

      const res = await request(app)
        .post(`/api/certificate/generate/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.certificate).toBeDefined();
      expect(res.body.certificate.certificateId).toMatch(/^CERT-/);
      expect(res.body.certificate.progressPercent).toBe(100);

      // Verify certificate saved in DB
      const dbCert = await Certificate.findOne({
        user: studentId,
        course: testCourse._id,
      });
      expect(dbCert).not.toBeNull();
    });

    it("should be idempotent and return existing certificate if already generated", async () => {
      // Complete 100%
      await LectureProgress.create({
        user: studentId,
        lecture: lecture1._id,
        completed: true,
      });
      await LectureProgress.create({
        user: studentId,
        lecture: lecture2._id,
        completed: true,
      });

      // 1. Generate first time
      const firstRes = await request(app)
        .post(`/api/certificate/generate/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      // 2. Call again
      const secondRes = await request(app)
        .post(`/api/certificate/generate/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(secondRes.status).toBe(200);
      expect(secondRes.body.certificate.certificateId).toBe(firstRes.body.certificate.certificateId);
    });
  });

  // ==========================================
  // FETCH & DOWNLOAD CERTIFICATE
  // ==========================================
  describe("GET /api/certificate/:courseId & Download", () => {
    beforeEach(async () => {
      // Pre-create certificate
      await Certificate.create({
        user: studentId,
        course: testCourse._id,
        certificateId: "CERT-ABCD1234",
        progressPercent: 100,
        issueDate: new Date(),
      });
    });

    it("should fetch certificate details for completed course", async () => {
      const res = await request(app)
        .get(`/api/certificate/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.certificate.certificateId).toBe("CERT-ABCD1234");
    });

    it("should download certificate and return valid PDF headers", async () => {
      const res = await request(app)
        .get(`/api/certificate/download/${testCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("application/pdf");
    });
  });
});
