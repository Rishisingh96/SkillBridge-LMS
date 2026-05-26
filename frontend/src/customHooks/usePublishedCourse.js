
// // customHooks/usePublishedCourse.js
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPublishedCourses } from "../redux/courseSlice";

// const usePublishedCourse = () => {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user);

//   useEffect(() => {
//     if (userData) {
//       dispatch(fetchPublishedCourses());
//     }
//   }, [dispatch, userData]);
// };

// export default usePublishedCourse;

// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchPublishedCourses } from "../redux/courseSlice";

// // const getPublishedCourse = () => {
// //     const dispatch = useDispatch();
// //     const { userData } = useSelector((state) => state.user);

// //     useEffect(() => {
// //         if (userData) {
// //             dispatch(fetchPublishedCourses());
// //         }
// //     }, [dispatch, userData]);
// // };

// // export default getPublishedCourse;