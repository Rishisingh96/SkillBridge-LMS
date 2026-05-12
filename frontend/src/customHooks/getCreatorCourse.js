import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";

const getCreatorCourse = () => {
  const dispatch = useDispatch()
  const {userData} = useSelector((state)=>state.user)
  
  useEffect(() => {
    const creatorCourse = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true });
        console.log(result.data);
        // dispatch(setCreatorCourseData(result.data))

      } catch (error) {
        console.log(error);
      }
    };
    
    if(userData) {
      creatorCourse();
    }
  }, [userData]);
};

export default getCreatorCourse;
