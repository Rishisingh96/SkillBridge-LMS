// redux/slices/enrollmentSlice.js

import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const BASE_URL =
  (import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:8000") + "/api/enrollment";

// ======================================================
// 📦 INITIAL STATE
// ======================================================

const initialState = {

  // All enrollments
  enrollments: [],

  // Only active courses
  activeEnrollments: [],

  // Expired enrollments
  expiredEnrollments: [],

  // Selected enrollment
  selectedEnrollment: null,

  // Single course enrollment status
  enrollmentStatus: null,

  // Loading state
  loading: false,

  // Error state
  error: null,
};

// ======================================================
// 📚 FETCH USER ENROLLMENTS
// ======================================================

export const fetchUserEnrollments =
  createAsyncThunk(

    "enrollment/fetchUserEnrollments",

    async (_, thunkAPI) => {

      try {

        const response = await axios.get(
          `${BASE_URL}/user`,
          {
            withCredentials: true,
          }
        );

        return response.data.enrollments;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||

          "Failed to fetch enrollments"
        );
      }
    }
  );

// ======================================================
// 🔍 CHECK ENROLLMENT STATUS
// ======================================================

export const checkEnrollmentStatus =
  createAsyncThunk(

    "enrollment/checkEnrollmentStatus",

    async (courseId, thunkAPI) => {

      try {

        const response = await axios.get(
          `${BASE_URL}/check/${courseId}`,
          {
            withCredentials: true,
          }
        );

        return response.data;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||

          "Failed to check enrollment"
        );
      }
    }
  );

// ======================================================
// 🎓 ENROLL FREE COURSE
// ======================================================

export const enrollFreeCourse =
  createAsyncThunk(

    "enrollment/enrollFreeCourse",

    async (courseId, thunkAPI) => {

      try {

        const response = await axios.post(
          `${BASE_URL}/enroll/${courseId}`,
          {},
          {
            withCredentials: true,
          }
        );

        return response.data.enrollment;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||

          "Enrollment failed"
        );
      }
    }
  );

// ======================================================
// 🧹 ENROLLMENT SLICE
// ======================================================

const enrollmentSlice = createSlice({

  name: "enrollment",

  initialState,

  reducers: {

    // ======================================================
    // 📌 SET SELECTED ENROLLMENT
    // ======================================================

    setSelectedEnrollment: (
      state,
      action
    ) => {

      state.selectedEnrollment =
        action.payload;
    },

    // ======================================================
    // ❌ CLEAR ALL ENROLLMENT DATA
    // ======================================================

    clearEnrollments: (state) => {

      state.enrollments = [];

      state.activeEnrollments = [];

      state.expiredEnrollments = [];

      state.selectedEnrollment = null;

      state.enrollmentStatus = null;

      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // ======================================================
    // 📚 FETCH USER ENROLLMENTS
    // ======================================================

    builder

      // ------------------------------
      // ⏳ PENDING
      // ------------------------------

      .addCase(
        fetchUserEnrollments.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      // ------------------------------
      // ✅ SUCCESS
      // ------------------------------

      .addCase(
        fetchUserEnrollments.fulfilled,
        (state, action) => {

          state.loading = false;

          state.enrollments =
            action.payload;

          // ✅ ACTIVE COURSES

          state.activeEnrollments =
            action.payload.filter(
              (item) =>
                item.status === "active"
            );

          // ❌ EXPIRED COURSES

          state.expiredEnrollments =
            action.payload.filter(
              (item) =>
                item.status === "expired"
            );
        }
      )

      // ------------------------------
      // ❌ FAILED
      // ------------------------------

      .addCase(
        fetchUserEnrollments.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // ======================================================
    // 🔍 CHECK ENROLLMENT STATUS
    // ======================================================

    builder

      // ------------------------------
      // ⏳ PENDING
      // ------------------------------

      .addCase(
        checkEnrollmentStatus.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      // ------------------------------
      // ✅ SUCCESS
      // ------------------------------

      .addCase(
        checkEnrollmentStatus.fulfilled,
        (state, action) => {

          state.loading = false;

          state.enrollmentStatus =
            action.payload;
        }
      )

      // ------------------------------
      // ❌ FAILED
      // ------------------------------

      .addCase(
        checkEnrollmentStatus.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // ======================================================
    // 🎓 FREE COURSE ENROLLMENT
    // ======================================================

    builder

      // ------------------------------
      // ⏳ PENDING
      // ------------------------------

      .addCase(
        enrollFreeCourse.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      // ------------------------------
      // ✅ SUCCESS
      // ------------------------------

      .addCase(
        enrollFreeCourse.fulfilled,
        (state, action) => {

          state.loading = false;

          // Add to top
          state.enrollments.unshift(
            action.payload
          );

          // Add to active list
          state.activeEnrollments.unshift(
            action.payload
          );
        }
      )

      // ------------------------------
      // ❌ FAILED
      // ------------------------------

      .addCase(
        enrollFreeCourse.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        }
      );
  },
});

// ======================================================
// 🚀 EXPORT ACTIONS
// ======================================================

export const {

  setSelectedEnrollment,

  clearEnrollments,

} = enrollmentSlice.actions;

// ======================================================
// 🚀 EXPORT REDUCER
// ======================================================

export default enrollmentSlice.reducer;