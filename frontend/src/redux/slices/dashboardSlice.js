import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// ==========================
// FETCH DASHBOARD STATS
// ==========================
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/course/dashboard-stats`,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

// ==========================
// FETCH RECENT ENROLLMENTS
// ==========================
export const fetchRecentEnrollments = createAsyncThunk(
  "dashboard/fetchRecentEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/course/recent-enrollments`,
        {
          withCredentials: true,
        }
      );

      return res.data.enrollments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch enrollments"
      );
    }
  }
);

// ==========================
// SLICE
// ==========================
const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      totalEarnings: 0,
      averageProgress: 0,
      recentEnrollments: 0,
      totalDownloads: 0,
      enrollmentByCourse: [],
    },

    recentEnrollments: [],

    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================
      // DASHBOARD STATS
      // ==========================
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;

        state.stats = {
          ...action.payload.stats,
          enrollmentByCourse: (action.payload.stats.enrollmentByCourse || []).map(item => ({ ...item }))
        };

        state.recentEnrollments = (action.payload.recentEnrollments || []).map(item => ({ ...item }));
      })

      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // RECENT ENROLLMENTS
      // ==========================
      .addCase(fetchRecentEnrollments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchRecentEnrollments.fulfilled, (state, action) => {
        state.loading = false;

        state.recentEnrollments = (action.payload || []).map(item => ({ ...item }));
      })

      .addCase(fetchRecentEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;