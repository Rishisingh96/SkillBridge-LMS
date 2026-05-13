import axios from "axios";
import { setCreatorCourseData } from "../courseSlice";

export const getCreatorCourses = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8000/api/course/getcreator", {
      withCredentials: true,
    });
    dispatch(setCreatorCourseData(response.data));
  } catch (error) {
    console.error("Error fetching creator courses:", error);
  }
};
