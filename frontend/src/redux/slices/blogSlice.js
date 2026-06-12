import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// ─── BLOG CATEGORY ASYNC THUNKS ────────────────────────────────────────────

export const fetchAllBlogCategories = createAsyncThunk(
  "blog/fetchAllBlogCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/categories`);
      return res.data.blogCategories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog categories"
      );
    }
  }
);

export const fetchBlogCategoryById = createAsyncThunk(
  "blog/fetchBlogCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/category/${categoryId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog category"
      );
    }
  }
);

export const createBlogCategory = createAsyncThunk(
  "blog/createBlogCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/blog/category/create`, categoryData, {
        withCredentials: true,
      });
      return res.data.blogCategory;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog category"
      );
    }
  }
);

export const togglePublishBlogCategory = createAsyncThunk(
  "blog/togglePublishBlogCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/blog/category/publish/${categoryId}`, {}, {
        withCredentials: true,
      });
      return res.data.blogCategory;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle publish blog category"
      );
    }
  }
);

export const deleteBlogCategory = createAsyncThunk(
  "blog/deleteBlogCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/blog/category/${categoryId}`, {
        withCredentials: true,
      });
      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog category"
      );
    }
  }
);

export const fetchCreatorBlogCategories = createAsyncThunk(
  "blog/fetchCreatorBlogCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/categories/creator`, {
        withCredentials: true,
      });
      return res.data.blogCategories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch creator blog categories"
      );
    }
  }
);

// ─── BLOG COURSE ASYNC THUNKS ─────────────────────────────────────────────

export const fetchBlogCoursesByCategory = createAsyncThunk(
  "blog/fetchBlogCoursesByCategory",
  async (blogCategoryId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/courses/${blogCategoryId}`);
      return res.data.blogCourses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog courses"
      );
    }
  }
);

export const fetchBlogCourseById = createAsyncThunk(
  "blog/fetchBlogCourseById",
  async (blogCourseId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/course/${blogCourseId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog course"
      );
    }
  }
);

export const createBlogCourse = createAsyncThunk(
  "blog/createBlogCourse",
  async ({ blogCategoryId, courseData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/blog/course/create/${blogCategoryId}`,
        courseData,
        {
          withCredentials: true,
        }
      );
      return res.data.blogCourse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog course"
      );
    }
  }
);

export const togglePublishBlogCourse = createAsyncThunk(
  "blog/togglePublishBlogCourse",
  async (blogCourseId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/blog/course/publish/${blogCourseId}`, {}, {
        withCredentials: true,
      });
      return res.data.blogCourse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle publish blog course"
      );
    }
  }
);

export const deleteBlogCourse = createAsyncThunk(
  "blog/deleteBlogCourse",
  async (blogCourseId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/blog/course/${blogCourseId}`, {
        withCredentials: true,
      });
      return blogCourseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog course"
      );
    }
  }
);

// ─── BLOG MODEL ASYNC THUNKS ───────────────────────────────────────────────

export const fetchBlogModelsByCourse = createAsyncThunk(
  "blog/fetchBlogModelsByCourse",
  async (blogCourseId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/models/${blogCourseId}`);
      return res.data.blogModels;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog models"
      );
    }
  }
);

export const fetchBlogModelById = createAsyncThunk(
  "blog/fetchBlogModelById",
  async (blogModelId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/model/${blogModelId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog model"
      );
    }
  }
);

export const createBlogModel = createAsyncThunk(
  "blog/createBlogModel",
  async ({ blogCourseId, modelData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/blog/model/create/${blogCourseId}`,
        modelData,
        {
          withCredentials: true,
        }
      );
      return res.data.blogModel;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog model"
      );
    }
  }
);

export const togglePublishBlogModel = createAsyncThunk(
  "blog/togglePublishBlogModel",
  async (blogModelId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/blog/model/publish/${blogModelId}`, {}, {
        withCredentials: true,
      });
      return res.data.blogModel;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle publish blog model"
      );
    }
  }
);

export const deleteBlogModel = createAsyncThunk(
  "blog/deleteBlogModel",
  async (blogModelId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/blog/model/${blogModelId}`, {
        withCredentials: true,
      });
      return blogModelId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog model"
      );
    }
  }
);

// ─── BLOG TOPIC ASYNC THUNKS ───────────────────────────────────────────────

export const fetchBlogTopicsByModel = createAsyncThunk(
  "blog/fetchBlogTopicsByModel",
  async (blogModelId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/topics/${blogModelId}`);
      return res.data.blogTopics;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog topics"
      );
    }
  }
);

export const fetchBlogTopicById = createAsyncThunk(
  "blog/fetchBlogTopicById",
  async (blogTopicId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog/topic/${blogTopicId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog topic"
      );
    }
  }
);

export const createBlogTopic = createAsyncThunk(
  "blog/createBlogTopic",
  async ({ blogModelId, topicData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/blog/topic/create/${blogModelId}`,
        topicData,
        {
          withCredentials: true,
        }
      );
      return res.data.blogTopic;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog topic"
      );
    }
  }
);

export const editBlogTopic = createAsyncThunk(
  "blog/editBlogTopic",
  async ({ blogTopicId, topicData, thumbnail }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(topicData).forEach((key) => {
        formData.append(key, topicData[key]);
      });
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await axios.put(
        `${BASE_URL}/api/blog/topic/edit/${blogTopicId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.blogTopic;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit blog topic"
      );
    }
  }
);

export const togglePublishBlogTopic = createAsyncThunk(
  "blog/togglePublishBlogTopic",
  async (blogTopicId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/blog/topic/publish/${blogTopicId}`, {}, {
        withCredentials: true,
      });
      return res.data.blogTopic;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle publish blog topic"
      );
    }
  }
);

export const deleteBlogTopic = createAsyncThunk(
  "blog/deleteBlogTopic",
  async (blogTopicId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/blog/topic/${blogTopicId}`, {
        withCredentials: true,
      });
      return blogTopicId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog topic"
      );
    }
  }
);

export const likeBlogTopic = createAsyncThunk(
  "blog/likeBlogTopic",
  async (blogTopicId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/blog/topic/like/${blogTopicId}`, {}, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like blog topic"
      );
    }
  }
);

export const addBlogComment = createAsyncThunk(
  "blog/addBlogComment",
  async ({ blogTopicId, message }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/blog/topic/comment/${blogTopicId}`,
        { message },
        {
          withCredentials: true,
        }
      );
      return res.data.comment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const addBlogReply = createAsyncThunk(
  "blog/addBlogReply",
  async ({ blogTopicId, commentId, message }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/blog/topic/comment/reply/${blogTopicId}/${commentId}`,
        { message },
        {
          withCredentials: true,
        }
      );
      return res.data.reply;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add reply"
      );
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────────────────

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    categories: [],
    creatorCategories: [],
    selectedCategory: null,
    courses: [],
    selectedCourse: null,
    models: [],
    selectedModel: null,
    topics: [],
    selectedTopic: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    setSelectedTopic: (state, action) => {
      state.selectedTopic = action.payload;
    },
    clearBlogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchAllBlogCategories ──
    builder
      .addCase(fetchAllBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogCategoryById ──
    builder
      .addCase(fetchBlogCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchBlogCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createBlogCategory ──
    builder
      .addCase(createBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── togglePublishBlogCategory ──
    builder
      .addCase(togglePublishBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(togglePublishBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── deleteBlogCategory ──
    builder
      .addCase(deleteBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
        state.creatorCategories = state.creatorCategories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchCreatorBlogCategories ──
    builder
      .addCase(fetchCreatorBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatorBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.creatorCategories = action.payload;
      })
      .addCase(fetchCreatorBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogCoursesByCategory ──
    builder
      .addCase(fetchBlogCoursesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCoursesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchBlogCoursesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogCourseById ──
    builder
      .addCase(fetchBlogCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchBlogCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createBlogCourse ──
    builder
      .addCase(createBlogCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createBlogCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── togglePublishBlogCourse ──
    builder
      .addCase(togglePublishBlogCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishBlogCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(
          (course) => course._id === action.payload._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(togglePublishBlogCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── deleteBlogCourse ──
    builder
      .addCase(deleteBlogCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
      })
      .addCase(deleteBlogCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogModelsByCourse ──
    builder
      .addCase(fetchBlogModelsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogModelsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
      })
      .addCase(fetchBlogModelsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogModelById ──
    builder
      .addCase(fetchBlogModelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogModelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedModel = action.payload;
      })
      .addCase(fetchBlogModelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createBlogModel ──
    builder
      .addCase(createBlogModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogModel.fulfilled, (state, action) => {
        state.loading = false;
        state.models.push(action.payload);
      })
      .addCase(createBlogModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── togglePublishBlogModel ──
    builder
      .addCase(togglePublishBlogModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishBlogModel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.models.findIndex(
          (model) => model._id === action.payload._id
        );
        if (index !== -1) {
          state.models[index] = action.payload;
        }
      })
      .addCase(togglePublishBlogModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── deleteBlogModel ──
    builder
      .addCase(deleteBlogModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogModel.fulfilled, (state, action) => {
        state.loading = false;
        state.models = state.models.filter(
          (model) => model._id !== action.payload
        );
      })
      .addCase(deleteBlogModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogTopicsByModel ──
    builder
      .addCase(fetchBlogTopicsByModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogTopicsByModel.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchBlogTopicsByModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBlogTopicById ──
    builder
      .addCase(fetchBlogTopicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogTopicById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTopic = action.payload;
      })
      .addCase(fetchBlogTopicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createBlogTopic ──
    builder
      .addCase(createBlogTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.push(action.payload);
      })
      .addCase(createBlogTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── editBlogTopic ──
    builder
      .addCase(editBlogTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBlogTopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.topics.findIndex(
          (topic) => topic._id === action.payload._id
        );
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(editBlogTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── togglePublishBlogTopic ──
    builder
      .addCase(togglePublishBlogTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishBlogTopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.topics.findIndex(
          (topic) => topic._id === action.payload._id
        );
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(togglePublishBlogTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── deleteBlogTopic ──
    builder
      .addCase(deleteBlogTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = state.topics.filter(
          (topic) => topic._id !== action.payload
        );
      })
      .addCase(deleteBlogTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── likeBlogTopic ──
    builder
      .addCase(likeBlogTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeBlogTopic.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedTopic) {
          state.selectedTopic.likes = action.payload.liked
            ? [...state.selectedTopic.likes, action.payload.userId]
            : state.selectedTopic.likes.filter(
                (id) => id !== action.payload.userId
              );
        }
      })
      .addCase(likeBlogTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── addBlogComment ──
    builder
      .addCase(addBlogComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlogComment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedTopic) {
          state.selectedTopic.comments.push(action.payload);
        }
      })
      .addCase(addBlogComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── addBlogReply ──
    builder
      .addCase(addBlogReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlogReply.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedTopic) {
          const comment = state.selectedTopic.comments.find(
            (c) => c._id === action.payload.commentId
          );
          if (comment) {
            comment.replies.push(action.payload);
          }
        }
      })
      .addCase(addBlogReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedCourse,
  setSelectedModel,
  setSelectedTopic,
  clearBlogError,
} = blogSlice.actions;

export default blogSlice.reducer;
