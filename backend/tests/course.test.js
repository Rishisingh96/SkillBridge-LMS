import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import Course from "../models/courseModel.js";
import Module from "../models/moduleModel.js";

describe("📚 Phase 2: Course Studio, Modules & Lectures Test Suite", () => {
  let educatorToken;
  let studentToken;
  let educatorId;

  beforeEach(async () => {
    // 1. Create Educator
    const educatorRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Educator John",
        email: `educator_${Date.now()}@example.com`,
        password: "Password123#",
        role: "educator",
      });
    educatorToken = educatorRes.body.token;
    educatorId = educatorRes.body.user._id;

    // 2. Create Student
    const studentRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Student Alice",
        email: `student_${Date.now()}@example.com`,
        password: "Password123#",
        role: "student",
      });
    studentToken = studentRes.body.token;
  });

  // ==========================================
  // COURSE CREATION & ACCESS CONTROL
  // ==========================================
  describe("POST /api/course/create", () => {
    it("should allow an educator to create a course successfully", async () => {
      const res = await request(app)
        .post("/api/course/create")
        .set("Authorization", `Bearer ${educatorToken}`)
        .send({
          title: "Fullstack Web Development",
          category: "Web Development",
          description: "Learn MERN stack from scratch",
          price: 999,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.course).toBeDefined();
      expect(res.body.course.title).toBe("Fullstack Web Development");
      expect(res.body.course.creator.toString()).toBe(educatorId.toString());

      // Verify in DB
      const dbCourse = await Course.findById(res.body.course._id);
      expect(dbCourse).not.toBeNull();
      expect(dbCourse.isPublished).toBe(false); // Default is draft
    });

    it("should reject student attempt to create a course with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/course/create")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          title: "Hacked Course",
          category: "Security",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("Access denied");
    });

    it("should reject course creation without title or category with 400", async () => {
      const res = await request(app)
        .post("/api/course/create")
        .set("Authorization", `Bearer ${educatorToken}`)
        .send({
          description: "Missing title and category",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Title and Category are required");
    });
  });

  // ==========================================
  // MODULES & LECTURES HIERARCHY
  // ==========================================
  describe("Modules & Lectures Architecture", () => {
    let createdCourseId;

    beforeEach(async () => {
      const course = await Course.create({
        title: "Node.js Masterclass",
        category: "Backend",
        creator: educatorId,
      });
      createdCourseId = course._id.toString();
    });

    it("should create a module under the course and update course.modules array", async () => {
      const res = await request(app)
        .post(`/api/course/create-module/${createdCourseId}`)
        .set("Authorization", `Bearer ${educatorToken}`)
        .send({
          title: "Module 1: Introduction",
          description: "Basics of Node.js",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.module).toBeDefined();
      expect(res.body.module.course.toString()).toBe(createdCourseId);

      // Verify course contains this module
      const updatedCourse = await Course.findById(createdCourseId);
      expect(updatedCourse.modules.map((m) => m.toString())).toContain(res.body.module._id);
    });

    it("should create a lecture under a module and update module.lectures array", async () => {
      // 1. Create module first
      const module = await Module.create({
        title: "Module 1: Core Concepts",
        course: createdCourseId,
      });

      // 2. Create lecture inside module
      const res = await request(app)
        .post(`/api/course/createlecture/${module._id}`)
        .set("Authorization", `Bearer ${educatorToken}`)
        .send({
          lectureTitle: "Lecture 1: Event Loop Explained",
          description: "In-depth guide to the Node.js event loop",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.lecture).toBeDefined();
      expect(res.body.lecture.module.toString()).toBe(module._id.toString());

      // Verify module contains this lecture
      const updatedModule = await Module.findById(module._id);
      expect(updatedModule.lectures.map((l) => l.toString())).toContain(res.body.lecture._id);
    });
  });

  // ==========================================
  // PUBLISHING & CATALOG VISIBILITY
  // ==========================================
  describe("Course Publishing & Public Catalog", () => {
    it("should toggle course publish state and reflect in public catalog", async () => {
      const course = await Course.create({
        title: "Docker for Developers",
        category: "DevOps",
        creator: educatorId,
        isPublished: false,
      });

      // 1. Toggle publish -> true
      const publishRes = await request(app)
        .put(`/api/course/publish/${course._id}`)
        .set("Authorization", `Bearer ${educatorToken}`);

      expect(publishRes.status).toBe(200);

      const dbCourse = await Course.findById(course._id);
      expect(dbCourse.isPublished).toBe(true);

      // 2. Verify published course appears in public catalog
      const catalogRes = await request(app).get("/api/course/getpublished");
      expect(catalogRes.status).toBe(200);
      expect(catalogRes.body.courses.some((c) => c._id.toString() === course._id.toString())).toBe(true);
    });
  });
});
