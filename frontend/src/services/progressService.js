import axios from "axios";
import { serverUrl } from "../App";

// Update lecture progress
export const updateLectureProgress = async (data) => {
  try {
    const response = await axios.post(
      `${serverUrl}/api/course/update`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating lecture progress:", error);
    throw error;
  }
};

// Get course progress
export const getCourseProgress = async (courseId, userId) => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/course/${courseId}/${userId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting course progress:", error);
    throw error;
  }
};

// Resume lecture (last watched)
export const resumeLecture = async (courseId, userId) => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/resume/${userId}/${courseId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error resuming lecture:", error);
    throw error;
  }
};

// Update watch time
export const updateWatchTime = async (data) => {
  try {
    const response = await axios.post(
      `${serverUrl}/api/course/watchtime`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating watch time:", error);
    throw error;
  }
};
