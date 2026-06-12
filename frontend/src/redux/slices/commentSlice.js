import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;

// =========================
// GET COMMENTS
// =========================
export const fetchLectureComments = createAsyncThunk(
  "comment/fetchLectureComments",
  async (lectureId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/course/comment/${lectureId}`,
        { withCredentials: true }
      );

      return res.data.comments;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// ADD COMMENT
// =========================
export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ lectureId, message }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/course/comment/${lectureId}`,
        { message },
        { withCredentials: true }
      );

      return res.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// DELETE COMMENT
// =========================
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ lectureId, commentId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/course/comment/${lectureId}/${commentId}`,
        { withCredentials: true }
      );

      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// ADD REPLY
// =========================
export const addReply = createAsyncThunk(
  "comment/addReply",
  async ({ lectureId, commentId, message }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/course/comment/reply/${lectureId}/${commentId}`,
        { message },
        { withCredentials: true }
      );

      return res.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// LIKE COMMENT
// =========================
export const toggleCommentLike = createAsyncThunk(
  "comment/toggleCommentLike",
  async ({ lectureId, commentId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/course/comment/like/${lectureId}/${commentId}`,
        {},
        { withCredentials: true }
      );

      return {
        commentId,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// DELETE REPLY
// =========================
export const deleteReply = createAsyncThunk(
  "comment/deleteReply",
  async ({ lectureId, commentId, replyId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/course/comment/reply/${lectureId}/${commentId}/${replyId}`,
        { withCredentials: true }
      );

      return { commentId, replyId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// LIKE REPLY
// =========================
export const toggleReplyLike = createAsyncThunk(
  "comment/toggleReplyLike",
  async ({ lectureId, commentId, replyId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/course/comment/reply/like/${lectureId}/${commentId}/${replyId}`,
        {},
        { withCredentials: true }
      );

      return {
        commentId,
        replyId,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// PIN COMMENT
// =========================
export const togglePinComment = createAsyncThunk(
  "comment/togglePinComment",
  async ({ lectureId, commentId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/course/comment/pin/${lectureId}/${commentId}`,
        {},
        { withCredentials: true }
      );

      return {
        commentId,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// =========================
// SLICE
// =========================
const commentSlice = createSlice({
  name: "comment",

  initialState: {
    comments: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH COMMENTS
      .addCase(fetchLectureComments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchLectureComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })

      .addCase(fetchLectureComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD COMMENT
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })

      // DELETE COMMENT
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (item) => item._id !== action.payload
        );
      })

      // ADD REPLY
      .addCase(addReply.fulfilled, (state, action) => {
        const updatedComment = action.payload;

        state.comments = state.comments.map((comment) =>
          comment._id === updatedComment._id
            ? updatedComment
            : comment
        );
      })

      // TOGGLE LIKE
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, data } = action.payload;

        const comment = state.comments.find(
          (item) => item._id === commentId
        );

        if (comment) {
          comment.likes = data.liked ? [...(comment.likes || []), action.meta.arg.userId] : (comment.likes || []).filter(id => id !== action.meta.arg.userId);
        }
      })

      // DELETE REPLY
      .addCase(deleteReply.fulfilled, (state, action) => {
        const { commentId, replyId } = action.payload;

        const comment = state.comments.find(
          (item) => item._id === commentId
        );

        if (comment) {
          comment.replies = comment.replies.filter(
            (reply) => reply._id !== replyId
          );
        }
      })

      // TOGGLE REPLY LIKE
      .addCase(toggleReplyLike.fulfilled, (state, action) => {
        const { commentId, replyId, data } = action.payload;

        const comment = state.comments.find(
          (item) => item._id === commentId
        );

        if (comment) {
          const reply = comment.replies.find(
            (item) => item._id === replyId
          );

          if (reply) {
            reply.likes = data.liked ? [...(reply.likes || []), action.meta.arg.userId] : (reply.likes || []).filter(id => id !== action.meta.arg.userId);
          }
        }
      })

      // TOGGLE PIN
      .addCase(togglePinComment.fulfilled, (state, action) => {
        const { commentId, data } = action.payload;

        const comment = state.comments.find(
          (item) => item._id === commentId
        );

        if (comment) {
          comment.isPinned = data.isPinned;
        }
      });
  },
});

export default commentSlice.reducer;