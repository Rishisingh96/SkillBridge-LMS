import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/userModel.js";

describe("🔐 Authentication & Role Authorization Test Suite", () => {
  const dummyUser = {
    name: "Rishi Student",
    email: "rishi.student@example.com",
    password: "Password123#",
    role: "student",
  };

  // ==========================================
  // SIGNUP TESTS
  // ==========================================
  describe("POST /api/auth/signup", () => {
    it("should successfully register a new student and return 201", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send(dummyUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user.role).toBe("student");
      // Password must NEVER be returned in response
      expect(res.body.user.password).toBeUndefined();

      // Verify token cookie is set
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.startsWith("token="))).toBe(true);

      // Verify stored in DB
      const dbUser = await User.findOne({ email: dummyUser.email });
      expect(dbUser).not.toBeNull();
      expect(dbUser.password).not.toBe(dummyUser.password); // Must be hashed!
    });

    it("should reject signup when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "onlyemail@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("All fields are required");
    });

    it("should reject duplicate email registration", async () => {
      // First registration
      await request(app).post("/api/auth/signup").send(dummyUser);

      // Duplicate registration attempt
      const res = await request(app).post("/api/auth/signup").send(dummyUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already exists");
    });

    it("should reject password shorter than 8 characters", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: "testshort@example.com",
          password: "123",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("at least 8 characters");
    });
  });

  // ==========================================
  // LOGIN TESTS
  // ==========================================
  describe("POST /api/auth/login", () => {
    it("should log in with correct credentials and return 200", async () => {
      // Create user first
      await request(app).post("/api/auth/signup").send(dummyUser);

      const res = await request(app).post("/api/auth/login").send({
        email: dummyUser.email,
        password: dummyUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(dummyUser.email);
    });

    it("should reject login with wrong password", async () => {
      await request(app).post("/api/auth/signup").send(dummyUser);

      const res = await request(app).post("/api/auth/login").send({
        email: dummyUser.email,
        password: "WrongPassword999#",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Incorrect password");
    });

    it("should return 404 for non-existent user email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "Password123#",
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("User not found");
    });

    it("should reject login for a banned user with 403 Forbidden", async () => {
      await request(app).post("/api/auth/signup").send(dummyUser);

      // Manually ban the user in DB
      await User.findOneAndUpdate(
        { email: dummyUser.email },
        { isBanned: true }
      );

      const res = await request(app).post("/api/auth/login").send({
        email: dummyUser.email,
        password: dummyUser.password,
      });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("banned");
    });
  });

  // ==========================================
  // LOGOUT TESTS
  // ==========================================
  describe("GET /api/auth/logout", () => {
    it("should successfully log out and clear auth cookie", async () => {
      const res = await request(app).get("/api/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Logout successful");
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
    });
  });

  // ==========================================
  // ROLE-BASED ACCESS CONTROL (RBAC) TESTS
  // ==========================================
  describe("RBAC Route Protection", () => {
    it("should reject unauthenticated access to admin routes with 401", async () => {
      const res = await request(app).get("/api/admin/users");
      expect(res.status).toBe(401);
    });

    it("should reject a student user attempting to access admin routes with 403 Forbidden", async () => {
      // 1. Sign up as a regular student
      const signupRes = await request(app).post("/api/auth/signup").send(dummyUser);
      const studentToken = signupRes.body.token;

      // 2. Try to hit admin-only route with student token
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("Access denied");
    });
  });
});
