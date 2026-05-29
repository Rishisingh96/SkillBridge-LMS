// redux/slices/couponSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // all coupons
  couponData: [],

  // educator coupons
  myCoupons: [],

  // selected coupon
  selectedCoupon: null,

  // applied coupon
  appliedCoupon: null,

  // pricing
  originalPrice: 0,
  discount: 0,
  finalPrice: 0,

  // states
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupon",

  initialState,

  reducers: {
    // =========================================
    // ALL COUPONS
    // =========================================

    setCouponData: (state, action) => {
      state.couponData = action.payload;
    },

    // =========================================
    // MY COUPONS
    // =========================================

    setMyCoupons: (state, action) => {
      state.myCoupons = action.payload;
    },

    // =========================================
    // SINGLE COUPON
    // =========================================

    setSelectedCoupon: (state, action) => {
      state.selectedCoupon = action.payload;
    },

    // =========================================
    // APPLIED COUPON
    // =========================================

    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },

    // =========================================
    // PRICE DETAILS
    // =========================================

    setCouponPricing: (state, action) => {
      state.originalPrice =
        action.payload.originalPrice;

      state.discount =
        action.payload.discount;

      state.finalPrice =
        action.payload.finalPrice;
    },

    // =========================================
    // REMOVE APPLIED COUPON
    // =========================================

    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;

      state.discount = 0;

      state.finalPrice =
        state.originalPrice;
    },

    // =========================================
    // LOADING
    // =========================================

    setCouponLoading: (state, action) => {
      state.loading = action.payload;
    },

    // =========================================
    // ERROR
    // =========================================

    setCouponError: (state, action) => {
      state.error = action.payload;
    },

    // =========================================
    // RESET
    // =========================================

    resetCouponState: (state) => {
      state.couponData = [];

      state.myCoupons = [];

      state.selectedCoupon = null;

      state.appliedCoupon = null;

      state.originalPrice = 0;

      state.discount = 0;

      state.finalPrice = 0;

      state.loading = false;

      state.error = null;
    },
  },
});

export const {
  setCouponData,
  setMyCoupons,
  setSelectedCoupon,
  setAppliedCoupon,
  setCouponPricing,
  clearAppliedCoupon,
  setCouponLoading,
  setCouponError,
  resetCouponState,
} = couponSlice.actions;

export default couponSlice.reducer;