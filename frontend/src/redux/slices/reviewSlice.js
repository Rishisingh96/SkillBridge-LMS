import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// ✅ AsyncThunk add karo
export const fetchAllReviews = createAsyncThunk(
  "review/fetchAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/review/getreview`, {
        withCredentials: true,
      });
      return res.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviewData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setReviewData: (state, action) => {
      state.reviewData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewData = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setReviewData } = reviewSlice.actions;
export default reviewSlice.reducer;