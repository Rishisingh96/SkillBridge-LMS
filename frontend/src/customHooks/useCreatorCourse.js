// // customHooks/useCreatorCourse.js
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCreatorCourses } from "../redux/courseSlice";

// const useCreatorCourse = () => {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user);

//   useEffect(() => {
//     if (userData && userData.role === "educator") {
//       dispatch(fetchCreatorCourses());
//     }
//   }, [dispatch, userData]);
// };

// export default useCreatorCourse;


// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchCreatorCourses } from "../redux/courseSlice";

// // const getCreatorCourse = () => {
// //   const dispatch = useDispatch();
// //   const { userData } = useSelector((state) => state.user);

// //   useEffect(() => {
// //     if (userData && userData.role === "educator") {
// //       dispatch(fetchCreatorCourses());
// //     }
// //   }, [dispatch, userData]);
// // };

// // export default getCreatorCourse;
