import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// ─────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",

  async (_, { rejectWithValue }) => {

    try {

      console.log("Fetching current user...");
      const res = await axios.get(
        `${BASE_URL}/api/user/getcurrentuser`,
        {
          withCredentials: true,
        }
      );

      console.log("Fetch user response:", res.data);
      return res.data;

    } catch (error) {

      console.error("Fetch user error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch user"
      );
    }
  }
);

// ─────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────
export const updateProfileData = createAsyncThunk(
  "user/updateProfileData",

  async (formData, { rejectWithValue }) => {

    try {

      const res = await axios.put(
        `${BASE_URL}/api/user/updateprofile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      return res.data.user;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Profile update failed"
      );
    }
  }
);

// ─────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────
const userSlice = createSlice({

  name: "user",

  initialState: {

    userData: null,

    loading: false,

    error: null,

    fetched: false,
    initialLoading: true,
  },

  reducers: {

    clearUserData: (state) => {

      state.userData = null;

      state.fetched = false;
    },

    setUserData: (state, action) => {
      state.userData = action.payload;
      state.fetched = true;
      state.initialLoading = false;
    },
  },

  extraReducers: (builder) => {

    builder

      // FETCH USER
      .addCase(fetchCurrentUser.pending, (state) => {

        state.loading = true;

        state.error = null;
      })

      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action) => {

          state.loading = false;
          state.initialLoading = false;

          state.userData = action.payload;

          state.fetched = true;
        }
      )

      .addCase(
        fetchCurrentUser.rejected,
        (state, action) => {

          state.loading = false;

          state.initialLoading = false;

          state.error = action.payload;

          state.fetched = true;
        }
      )

      // UPDATE PROFILE
      .addCase(updateProfileData.pending, (state) => {

        state.loading = true;
      })

      .addCase(
        updateProfileData.fulfilled,
        (state, action) => {

          state.loading = false;

          state.userData = action.payload;
        }
      )

      .addCase(
        updateProfileData.rejected,
        (state, action) => {

          state.loading = false;

          state.error = action.payload;
        }
      );
  },
});

export const {
  clearUserData,
  setUserData,
} = userSlice.actions;

export default userSlice.reducer;