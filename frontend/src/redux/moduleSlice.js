import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "../App";

// Async Thunks
export const fetchModules = createAsyncThunk(
  "module/fetchModules",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/course-modules/${courseId}`,
        { withCredentials: true }
      );
      return response.data.modules;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch modules");
    }
  }
);

export const createModule = createAsyncThunk(
  "module/createModule",
  async ({ courseId, moduleData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/course/create-module/${courseId}`,
        moduleData,
        { withCredentials: true }
      );
      return response.data.module;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create module");
    }
  }
);

export const updateModule = createAsyncThunk(
  "module/updateModule",
  async ({ moduleId, moduleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${serverUrl}/api/course/update-module/${moduleId}`,
        moduleData,
        { withCredentials: true }
      );
      return response.data.module;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update module");
    }
  }
);

export const deleteModule = createAsyncThunk(
  "module/deleteModule",
  async (moduleId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${serverUrl}/api/course/delete-module/${moduleId}`,
        { withCredentials: true }
      );
      return moduleId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete module");
    }
  }
);

const moduleSlice = createSlice({  //Slice = State + Reducers + Actions
  name: "module",

  initialState: {    // Ye Redux state hai.
    moduleData: [],
    loading: false,
    error: null,
  },

  reducers: {
    setModuleData: (state, action) => {
      state.moduleData = action.payload;  //me store karta.
    // state.moduleData =>Redux Store ke moduleData ko API wale fresh data se replace karo
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleData = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Module
      .addCase(createModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModule.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleData.push(action.payload);
      })
      .addCase(createModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Module
      .addCase(updateModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.moduleData.findIndex(
          (module) => module._id === action.payload._id
        );
        if (index !== -1) {
          state.moduleData[index] = action.payload;
        }
      })
      .addCase(updateModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Module
      .addCase(deleteModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleData = state.moduleData.filter(
          (module) => module._id !== action.payload
        );
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setModuleData, clearError } = moduleSlice.actions;
export default moduleSlice.reducer;