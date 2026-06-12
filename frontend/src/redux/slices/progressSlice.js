import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;

// ======================================================
// GET COURSE PROGRESS
// ======================================================

export const fetchCourseProgress = createAsyncThunk(
  "progress/fetchCourseProgress",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/course/progress/course/${courseId}`,
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
// UPDATE PROGRESS
// ======================================================

export const updateProgress = createAsyncThunk(
  "progress/updateProgress",
  async ({ lectureId, currentPosition }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/course/progress/update`,
        {
          lectureId,
          currentPosition,
        },
        { withCredentials: true }
      );

      return res.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update progress"
      );
    }
  }
);

// ======================================================
// RESUME LECTURE
// ======================================================

export const fetchResumeLecture = createAsyncThunk(
  "progress/fetchResumeLecture",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/course/progress/resume/${courseId}`,
        { withCredentials: true }
      );

      return {
        courseId,
        lecture: res.data,
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
  courseProgress: {},
  resumeLecture: null,
  certificateGenerated: {},
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
    setCertificateGenerated: (state, action) => {
      state.certificateGenerated[action.payload.courseId] = true;
    },
    clearAllProgress: (state) => {
      state.courseProgress = {};
      state.resumeLecture = null;
      state.certificateGenerated = {};
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // FETCH COURSE PROGRESS
    // ==================================================
    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.courseProgress[action.payload.courseId] = action.payload.data;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================================================
    // UPDATE PROGRESS
    // ==================================================
    builder
      .addCase(updateProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        // Progress updated successfully
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ==================================================
    // RESUME LECTURE
    // ==================================================
    builder
      .addCase(fetchResumeLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeLecture = action.payload.lecture;
      })
      .addCase(fetchResumeLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProgressError,
  setCertificateGenerated,
  clearAllProgress,
} = progressSlice.actions;

export default progressSlice.reducer;