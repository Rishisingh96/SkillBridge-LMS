// // customHooks/useAllReviews.js
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { fetchAllReviews } from "../redux/reviewSlice";

// const useAllReviews = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchAllReviews());
//   }, [dispatch]);
// };

// export default useAllReviews;

// // import React, { useEffect } from "react";
// // import { serverUrl } from "../App";
// // import axios from "axios";
// // import { useDispatch } from "react-redux";
// // import { setReviewData } from "../redux/reviewSlice";

// // const getAllReviews = () => {
// //     const dispatch = useDispatch();

// //     useEffect(()=>{
// //         const allReviews = async () => {
// //            try {
// //               const result = await axios.get(serverUrl + "/api/review/getreview",
// //                 {withCredentials:true});
// //              dispatch(setReviewData(result.data.review))
// //             //  console.log(result.data)
// //            } catch (error) {
// //             console.log(error);
// //            }
// //         }
// //         allReviews();
// //     },[]);
    
   
// // };

// // export default getAllReviews;