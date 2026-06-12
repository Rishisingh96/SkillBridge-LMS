// redux/slices/couponSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

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

// ─── ASYNC THUNKS ────────────────────────────────────────────

export const fetchAllCoupons = createAsyncThunk(
  "coupon/fetchAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/coupon/all`, {
        withCredentials: true,
      });
      return res.data.coupons;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

export const fetchMyCoupons = createAsyncThunk(
  "coupon/fetchMyCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/coupon/my-coupons`, {
        withCredentials: true,
      });
      return res.data.coupons;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my coupons"
      );
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/coupon/create`, couponData, {
        withCredentials: true,
      });
      return res.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/coupon/update/${couponId}`,
        couponData,
        {
          withCredentials: true,
        }
      );
      return res.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update coupon"
      );
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/coupon/delete/${couponId}`, {
        withCredentials: true,
      });
      return couponId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete coupon"
      );
    }
  }
);

export const toggleCouponStatus = createAsyncThunk(
  "coupon/toggleCouponStatus",
  async (couponId, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/coupon/toggle/${couponId}`, {}, {
        withCredentials: true,
      });
      return res.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle coupon status"
      );
    }
  }
);

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
  extraReducers: (builder) => {
    // ── fetchAllCoupons ──
    builder
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.couponData = action.payload;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchMyCoupons ──
    builder
      .addCase(fetchMyCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.myCoupons = action.payload;
      })
      .addCase(fetchMyCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createCoupon ──
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponData.push(action.payload);
        state.myCoupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── updateCoupon ──
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.couponData.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.couponData[index] = action.payload;
        const myIndex = state.myCoupons.findIndex(c => c._id === action.payload._id);
        if (myIndex !== -1) state.myCoupons[myIndex] = action.payload;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── deleteCoupon ──
    builder
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponData = state.couponData.filter(c => c._id !== action.payload);
        state.myCoupons = state.myCoupons.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── toggleCouponStatus ──
    builder
      .addCase(toggleCouponStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.couponData.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.couponData[index] = action.payload;
        const myIndex = state.myCoupons.findIndex(c => c._id === action.payload._id);
        if (myIndex !== -1) state.myCoupons[myIndex] = action.payload;
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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