// import { createSlice } from "@reduxjs/toolkit";

// const courseSlice = createSlice({
//     name:"course", 
//     initialState:{
//         creatorCourseData:null,
//         courseData:null, 
//         selectedCourse:null
//     },
//     reducers:{
//         setCreatorCourseData:(state, action)=>{
//             state.creatorCourseData = action.payload
//         },
//         setCourseData:(state, action)=>{
//             state.courseData = action.payload
//         },
//         setSelectedCourse:(state, action) =>{
//             state.selectedCourse = action.payload
//         }
//     }  
// })

// export const {setCreatorCourseData, setCourseData} = courseSlice.actions

// export const {setSelectedCourse} = courseSlice.actions

// export default courseSlice.reducer


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

// ─── ASYNC THUNKS ────────────────────────────────────────────

export const fetchCreatorCourses = createAsyncThunk(
  "course/fetchCreatorCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/course/getcreator`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch creator courses"
      );
    }
  }
);

export const fetchPublishedCourses = createAsyncThunk(
  "course/fetchPublishedCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/course/getpublished`, {
        withCredentials: true,
      });
      return res.data.courses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch published courses"
      );
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/course/getcourse/${courseId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch course"
      );
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────

const courseSlice = createSlice({
  name: "course",
  initialState: {
    creatorCourseData: [],
    courseData: [],
    selectedCourse: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    clearCourseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // ── fetchCreatorCourses ──
    builder
      .addCase(fetchCreatorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.creatorCourseData = action.payload;
      })
      .addCase(fetchCreatorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchPublishedCourses ──
    builder
      .addCase(fetchPublishedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courseData = action.payload;
      })
      .addCase(fetchPublishedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchCourseById ──
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCourse, clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;

