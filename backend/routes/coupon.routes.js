// routes/coupon.routes.js

import express from "express";

import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, getMyCoupons, getSingleCoupon, toggleCouponStatus, updateCoupon } from "../controller/couponController.js";



const router = express.Router();

// ✅ CREATE COUPON
router.post("/create",isAuth,isRole("admin", "educator"),createCoupon);

// ✅ APPLY COUPON
router.post(
  "/apply",
  isAuth,
  applyCoupon
);

// ✅ GET ALL COUPONS (ADMIN)
router.get(
  "/all",
  isAuth,
  isRole("admin"),
  getAllCoupons
);

// ✅ EDUCATOR COUPONS
router.get(
  "/my-coupons",
  isAuth,
  isRole("educator"),
  getMyCoupons
);

// ✅ SINGLE COUPON
router.get(
  "/:id",
  isAuth,
  getSingleCoupon
);

// ✅ UPDATE COUPON
router.put(
  "/update/:id",
  isAuth,
  isRole("admin", "educator"),
  updateCoupon
);

// ✅ DELETE COUPON
router.delete(
  "/delete/:id",
  isAuth,
  isRole("admin", "educator"),
  deleteCoupon
);

// ✅ TOGGLE ACTIVE / INACTIVE
router.patch(
  "/toggle/:id",
  isAuth,
  isRole("admin", "educator"),
  toggleCouponStatus
);

export default router;