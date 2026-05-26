import axios from "axios";
import { toast } from "react-toastify";
import { fetchCreatorCourses } from "../slices/courseSlice";

const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

// ── Create Course ──────────────────────────────────────────
export const createCourse = (courseData, navigate) => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/api/course/create`, courseData, {
      withCredentials: true,
    });
    toast.success("Course created successfully");
    navigate("/courses");
    dispatch(fetchCreatorCourses()); // refresh list
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create course");
  }
};

// ── Delete Course ──────────────────────────────────────────
export const deleteCourse = (courseId) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/course/remove/${courseId}`, {
      withCredentials: true,
    });
    toast.success("Course deleted successfully");
    dispatch(fetchCreatorCourses()); // refresh list
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete course");
  }
};

// ── Toggle Publish ─────────────────────────────────────────
export const togglePublish = (courseId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/api/course/publish/${courseId}`,
      {},
      { withCredentials: true }
    );
    toast.success(res.data.message);
    dispatch(fetchCreatorCourses());
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to toggle publish");
  }
};