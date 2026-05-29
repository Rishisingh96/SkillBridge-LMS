// controllers/couponController.js

import Coupon from "../models/couponModel.js";
import Course from "../models/courseModel.js";


// ======================================================
// ✅ CREATE COUPON
// ======================================================

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minPurchase,
      expiryDate,
      usageLimit,
      couponFor,
      applicableCourses,
    } = req.body;

    // existing coupon
    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    // educator course ownership check
    if (
      req.user.role === "educator" &&
      couponFor === "specific"
    ) {
      for (const courseId of applicableCourses) {
        const course = await Course.findById(
          courseId
        );

        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Course not found",
          });
        }

        if (
          course.creator.toString() !==
          req.user._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You can only create coupons for your own courses",
          });
        }
      }
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),

      discountType,

      discountValue,

      maxDiscount,

      minPurchase,

      expiryDate,

      usageLimit,

      couponFor,

      applicableCourses,

      createdBy: req.user._id,

      creatorRole: req.user.role,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// ✅ APPLY COUPON
// ======================================================

export const applyCoupon = async (req, res) => {
  try {
    const {
      code,
      courseId,
    } = req.body;

    // find course
    const course = await Course.findById(
      courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // find coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    // expired
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    // usage limit
    if (
      coupon.usedCount >=
      coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon usage limit reached",
      });
    }

    // specific course validation
    if (
      coupon.couponFor === "specific"
    ) {
      const validCourse =
        coupon.applicableCourses.some(
          (courseItem) =>
            courseItem.toString() ===
            course._id.toString()
        );

      if (!validCourse) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon not valid for this course",
        });
      }
    }

    // original price
    const originalPrice =
      course.price;

    // minimum purchase
    if (
      originalPrice <
      coupon.minPurchase
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase ₹${coupon.minPurchase}`,
      });
    }

    // calculate discount
    let discount = 0;

    // fixed
    if (
      coupon.discountType === "fixed"
    ) {
      discount =
        coupon.discountValue;
    }

    // percentage
    else {
      discount =
        (originalPrice *
          coupon.discountValue) /
        100;

      // max discount
      if (
        coupon.maxDiscount > 0 &&
        discount >
          coupon.maxDiscount
      ) {
        discount =
          coupon.maxDiscount;
      }
    }

    // prevent negative
    if (discount > originalPrice) {
      discount = originalPrice;
    }

    const finalPrice =
      originalPrice - discount;

    res.status(200).json({
      success: true,

      couponId: coupon._id,

      couponCode: coupon.code,

      originalPrice,

      discount,

      finalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// ✅ GET ALL COUPONS
// ======================================================

export const getAllCoupons =
  async (req, res) => {
    try {
      const coupons =
        await Coupon.find()
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        coupons,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ======================================================
// ✅ GET EDUCATOR COUPONS
// ======================================================

export const getMyCoupons =
  async (req, res) => {
    try {
      const coupons =
        await Coupon.find({
          createdBy:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        coupons,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ======================================================
// ✅ GET SINGLE COUPON
// ======================================================

export const getSingleCoupon =
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });
      }

      res.status(200).json({
        success: true,
        coupon,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ======================================================
// ✅ UPDATE COUPON
// ======================================================

export const updateCoupon =
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });
      }

      // educator ownership
      if (
        req.user.role ===
          "educator" &&
        coupon.createdBy.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      const updatedCoupon =
        await Coupon.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Coupon updated successfully",
        updatedCoupon,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ======================================================
// ✅ DELETE COUPON
// ======================================================

export const deleteCoupon =
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });
      }

      // educator ownership
      if (
        req.user.role ===
          "educator" &&
        coupon.createdBy.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      await coupon.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Coupon deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ======================================================
// ✅ TOGGLE COUPON STATUS
// ======================================================

export const toggleCouponStatus =
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });
      }

      // educator ownership
      if (
        req.user.role ===
          "educator" &&
        coupon.createdBy.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      coupon.isActive =
        !coupon.isActive;

      await coupon.save();

      res.status(200).json({
        success: true,
        message:
          coupon.isActive
            ? "Coupon activated"
            : "Coupon deactivated",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };