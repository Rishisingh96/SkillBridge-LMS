import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL + "/api/admin";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ======================================================
// USERS
// ======================================================

// Get All Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users");
      return res.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Ban User
export const banUser = createAsyncThunk(
  "admin/banUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/ban/${userId}`);

      dispatch(fetchAllUsers());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Unban User
export const unbanUser = createAsyncThunk(
  "admin/unbanUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/unban/${userId}`);

      dispatch(fetchAllUsers());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/user/${userId}`);

      dispatch(fetchAllUsers());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Change Role
export const changeUserRole = createAsyncThunk(
  "admin/changeUserRole",
  async ({ userId, role }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/role/${userId}`, {
        role,
      });

      dispatch(fetchAllUsers());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ======================================================
// COURSES
// ======================================================

// Get Courses
export const fetchCourses = createAsyncThunk(
  "admin/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/courses");
      return res.data.courses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete Course
export const deleteCourse = createAsyncThunk(
  "admin/deleteCourse",
  async (courseId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.delete(`/course/${courseId}`);

      dispatch(fetchCourses());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Toggle Publish
export const toggleCoursePublish = createAsyncThunk(
  "admin/toggleCoursePublish",
  async (courseId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(
        `/course/publish/${courseId}`
      );

      dispatch(fetchCourses());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ======================================================
// PLATFORM STATS
// ======================================================

export const fetchPlatformStats = createAsyncThunk(
  "admin/fetchPlatformStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/stats");
      return res.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  users: [],
  courses: [],
  stats: {},

  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= USERS =================

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= COURSES =================

      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })

      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= STATS =================

      .addCase(fetchPlatformStats.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        fetchPlatformStats.fulfilled,
        (state, action) => {
          state.loading = false;
          state.stats = action.payload;
        }
      )

      .addCase(
        fetchPlatformStats.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default adminSlice.reducer;