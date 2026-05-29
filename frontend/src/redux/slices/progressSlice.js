import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

// ======================================================
// GET COURSE PROGRESS
// ======================================================

export const fetchCourseProgress = createAsyncThunk(
  "progress/fetchCourseProgress",
  async ({ courseId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/progress/course/${courseId}/${userId}`,
        { withCredentials: true }
      );

      return {
        courseId,
        data: res.data,
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch progress"
      );
    }
  }
);

// ======================================================
// UPDATE WATCH TIME
// ======================================================

export const updateWatchTime = createAsyncThunk(
  "progress/updateWatchTime",
  async ({ userId, lectureId, watchTime }, { rejectWithValue }) => {
    try {

      const res = await axios.post(
        `${BASE_URL}/api/progress/watchtime`,
        {
          userId,
          lectureId,
          watchTime,
        },
        { withCredentials: true }
      );

      return res.data.progress;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update watch time"
      );
    }
  }
);

// ======================================================
// COMPLETE LECTURE
// ======================================================

export const completeLecture = createAsyncThunk(
  "progress/completeLecture",
  async (
    { userId, lectureId, watched, watchTime, completed },
    { rejectWithValue }
  ) => {
    try {

      const res = await axios.post(
        `${BASE_URL}/api/progress/update`,
        {
          userId,
          lectureId,
          watched,
          watchTime,
          completed,
        },
        { withCredentials: true }
      );

      return res.data.progress;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete lecture"
      );
    }
  }
);

// ======================================================
// RESUME LECTURE
// ======================================================

export const fetchResumeLecture = createAsyncThunk(
  "progress/fetchResumeLecture",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {

      const res = await axios.get(
        `${BASE_URL}/api/progress/resume/${userId}/${courseId}`,
        { withCredentials: true }
      );

      return {
        courseId,
        lecture: res.data.lecture,
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch resume lecture"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {

  loading: false,
  error: null,

  // Course wise progress
  courseProgress: {},

  // Resume lecture
  resumeLectures: {},

  // Current watch progress
  currentProgress: null,

};

// ======================================================
// SLICE
// ======================================================

const progressSlice = createSlice({
  name: "progress",
  initialState,

  reducers: {

    clearProgressError: (state) => {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    // ==================================================
    // FETCH COURSE PROGRESS
    // ==================================================

    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;

        state.courseProgress[action.payload.courseId] =
          action.payload.data;
      })

      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================================================
    // UPDATE WATCH TIME
    // ==================================================

    builder
      .addCase(updateWatchTime.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      });

    // ==================================================
    // COMPLETE LECTURE
    // ==================================================

    builder
      .addCase(completeLecture.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      });

    // ==================================================
    // RESUME LECTURE
    // ==================================================

    builder
      .addCase(fetchResumeLecture.fulfilled, (state, action) => {

        state.resumeLectures[action.payload.courseId] =
          action.payload.lecture;

      });
  },
});

export const {
  clearProgressError,
} = progressSlice.actions;

export default progressSlice.reducer;