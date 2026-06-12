import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

// ========================================
// Generate Certificate
// ========================================
export const generateCertificate = createAsyncThunk(
  "certificate/generateCertificate",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/course/certificate/generate/${courseId}`,
        {},
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to generate certificate"
      );
    }
  }
);

// ========================================
// Get Certificate
// ========================================
export const getCertificate = createAsyncThunk(
  "certificate/getCertificate",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/course/certificate/${courseId}`,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch certificate"
      );
    }
  }
);


// Download Certificate


const certificateSlice = createSlice({
  name: "certificate",

  initialState: {
    certificate: null,
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    clearCertificateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },

    clearCertificate: (state) => {
      state.certificate = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Generate Certificate
      .addCase(generateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.certificate = action.payload.certificate;
      })

      .addCase(generateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Certificate
      .addCase(getCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.certificate = action.payload.certificate;
      })

      .addCase(getCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCertificateState,
  clearCertificate,
} = certificateSlice.actions;

export default certificateSlice.reducer;