import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import crypto from "crypto";
import app from "../app.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Coupon from "../models/couponModel.js";
import Enrollment from "../models/enrollmentModel.js";

describe("💳 Phase 3: Payments, Coupons & Enrollment Lifecycle", () => {
  let studentToken;
  let studentId;
  let educatorToken;
  let educatorId;
  let freeCourse;
  let paidCourse;

  beforeEach(async () => {
    // 1. Create Student
    const studentRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Pay Student",
        email: `pay_student_${Date.now()}@example.com`,
        password: "Password123#",
        role: "student",
      });
    studentToken = studentRes.body.token;
    studentId = studentRes.body.user._id;

    // 2. Create Educator
    const educatorRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Pay Educator",
        email: `pay_educator_${Date.now()}@example.com`,
        password: "Password123#",
        role: "educator",
      });
    educatorToken = educatorRes.body.token;
    educatorId = educatorRes.body.user._id;

    // 3. Create Free Course
    freeCourse = await Course.create({
      title: "Free Git & GitHub Crash Course",
      category: "Tools",
      price: 0,
      creator: educatorId,
      isPublished: true,
    });

    // 4. Create Paid Course
    paidCourse = await Course.create({
      title: "Mastering React 18 & Redux Toolkit",
      category: "Web Development",
      price: 1999,
      creator: educatorId,
      isPublished: true,
    });
  });

  // ==========================================
  // FREE ENROLLMENT
  // ==========================================
  describe("POST /api/enrollment/enroll/:courseId", () => {
    it("should allow a student to enroll in a free course (price = 0)", async () => {
      const res = await request(app)
        .post(`/api/enrollment/enroll/${freeCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("enrolled successfully");

      // Verify Enrollment created in DB
      const enrollment = await Enrollment.findOne({
        user: studentId,
        course: freeCourse._id,
        status: "active",
      });
      expect(enrollment).not.toBeNull();
    });

    it("should strictly reject free enrollment attempt on a paid course (price > 0)", async () => {
      const res = await request(app)
        .post(`/api/enrollment/enroll/${paidCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Paid course requires payment");
    });

    it("should reject duplicate enrollment if student is already actively enrolled", async () => {
      // First enrollment
      await request(app)
        .post(`/api/enrollment/enroll/${freeCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      // Second enrollment attempt
      const res = await request(app)
        .post(`/api/enrollment/enroll/${freeCourse._id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Already enrolled");
    });
  });

  // ==========================================
  // RAZORPAY PAYMENT VERIFICATION & SECURITY
  // ==========================================
  describe("POST /api/order/verifypayment", () => {
    const dummyOrderId = "order_9A33XTEST123";
    const dummyPaymentId = "pay_8B44YTEST456";

    it("should reject forged or tampered payment signature with 400", async () => {
      const res = await request(app)
        .post("/api/order/verifypayment")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          courseId: paidCourse._id.toString(),
          razorpay_order_id: dummyOrderId,
          razorpay_payment_id: dummyPaymentId,
          razorpay_signature: "forged_invalid_signature_xyz",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Invalid payment signature");
    });

    it("should verify valid HMAC-SHA256 signature and grant course access", async () => {
      process.env.RAZORPAY_KEY_SECRET = "test_razorpay_secret_key_12345";

      // Compute authentic HMAC-SHA256 signature
      const validSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(dummyOrderId + "|" + dummyPaymentId)
        .digest("hex");

      const res = await request(app)
        .post("/api/order/verifypayment")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          courseId: paidCourse._id.toString(),
          razorpay_order_id: dummyOrderId,
          razorpay_payment_id: dummyPaymentId,
          razorpay_signature: validSignature,
          name: "Pay Student",
          email: "pay@example.com",
          originalPrice: 1999,
          discountAmount: 0,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify Enrollment record created
      const enrollment = await Enrollment.findOne({
        user: studentId,
        course: paidCourse._id,
      });
      expect(enrollment).not.toBeNull();
      expect(enrollment.status).toBe("active");
    });
  });

  // ==========================================
  // COUPON VALIDATION & PRICING
  // ==========================================
  describe("POST /api/coupon/apply", () => {
    it("should apply percentage coupon and calculate correct discounted price", async () => {
      // Create active coupon
      const coupon = await Coupon.create({
        code: "SUPER50",
        discountType: "percentage",
        discountValue: 50,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
        usageLimit: 100,
        isActive: true,
        createdBy: educatorId,
        creatorRole: "educator",
      });

      const res = await request(app)
        .post("/api/coupon/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          code: "SUPER50",
          courseId: paidCourse._id.toString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.discount).toBe(999.5); // 50% of 1999
    });

    it("should reject expired coupon", async () => {
      await Coupon.create({
        code: "EXPIRED10",
        discountType: "fixed",
        discountValue: 100,
        expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired yesterday
        usageLimit: 50,
        isActive: true,
        createdBy: educatorId,
        creatorRole: "educator",
      });

      const res = await request(app)
        .post("/api/coupon/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          code: "EXPIRED10",
          courseId: paidCourse._id.toString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("expired");
    });
  });
});
