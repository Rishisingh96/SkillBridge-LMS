// // customHooks/useCurrentUser.js
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { fetchCurrentUser } from "../redux/userSlice";

// const useCurrentUser = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchCurrentUser());
//   }, [dispatch]);
// };

// export default useCurrentUser;

// // import React, { useEffect } from 'react'
// // import axios from 'axios'
// // import { serverUrl } from '../App'
// // import { useDispatch } from 'react-redux'
// // import { setUserData } from '../redux/userSlice'

// // const getCurrentUser = () => {
// // const dispatch = useDispatch()
// //  useEffect(()=>{
// //     const fetchUser = async () =>{
// //         try {
// //             const result = await axios.get(serverUrl + "/api/user/getcurrentuser", {withCredentials:true})
// //             console.log("getCurrentUser API response:", result.data)
// //             dispatch(setUserData(result.data))
// //         } catch (error) {
// //             console.log("getCurrentUser error:", error);
// //             dispatch(setUserData(null))
// //         }
// //     }
// //     fetchUser()
// //  },[])
// // }

// // export default getCurrentUser
