import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// ────────────────────────────────────────────

//  getCurrentUser — app load pe user fetch karo
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/getcurrentuser`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.error = action.payload;
      });
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;