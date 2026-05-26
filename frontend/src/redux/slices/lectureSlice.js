import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "../../App";

// Async Thunks
export const fetchLectures = createAsyncThunk(
  "lecture/fetchLectures",
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/courselecture/${moduleId}`,
        { withCredentials: true }
      );
      return response.data.lectures || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch lectures");
    }
  }
);

export const createLecture = createAsyncThunk(
  "lecture/createLecture",
  async ({ moduleId, lectureData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/course/createlecture/${moduleId}`,
        lectureData,
        { withCredentials: true }
      );
      return response.data.lecture;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create lecture");
    }
  }
);

export const updateLecture = createAsyncThunk(
  "lecture/updateLecture",
  async ({ lectureId, lectureData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        lectureData,
        { withCredentials: true }
      );
      return response.data.lecture;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update lecture");
    }
  }
);

export const deleteLecture = createAsyncThunk(
  "lecture/deleteLecture",
  async (lectureId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${serverUrl}/api/course/removelecture/${lectureId}`,
        { withCredentials: true }
      );
      return lectureId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete lecture");
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState: {
    lectureData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLectureData: (state, action) => {
      state.lectureData = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lectures
      .addCase(fetchLectures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.lectureData = action.payload;
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Lecture
      .addCase(createLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectureData.push(action.payload);
      })
      .addCase(createLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Lecture
      .addCase(updateLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLecture.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lectureData.findIndex(
          (lecture) => lecture._id === action.payload._id
        );
        if (index !== -1) {
          state.lectureData[index] = action.payload;
        }
      })
      .addCase(updateLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Lecture
      .addCase(deleteLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectureData = state.lectureData.filter(
          (lecture) => lecture._id !== action.payload
        );
      })
      .addCase(deleteLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLectureData, clearError } = lectureSlice.actions;
export default lectureSlice.reducer;


