import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./page/Home";

import SignUp from "./page/SignUp";

import Login from "./page/Login";

import { ToastContainer } from "react-toastify";

import { useSelector } from "react-redux";

import Profile from "./page/Profile";

import ForgetPassword from "./page/ForgetPassword";

import EditProfile from "./page/EditProfile";

import Dashboard from "./page/Educator/Dashboard";

import Courses from "./page/Educator/Courses";

import CreateCourse from "./page/Educator/CreateCourse";

import EditCourse from "./page/Educator/EditCourse";

import AllCourses from "./page/AllCourses";

import CreateLecture from "./page/Educator/CreateLecture";

import EditLecture from "./page/Educator/EditLecture";

import ViewCourse from "./page/Educator/ViewCourse";

import ScrollToTop from "./component/ScrollToTop";

import ViewLecture from "./page/ViewLecture";

import MyEnrolledCourses from "./page/MyEnrolledCourses";

import getCurrentUser from "./customHooks/getCurrentUser";

import getCreatorCourse from "./customHooks/getCreatorCourse";

import getPublishedCourse from "./customHooks/getPublishedCourse";
import getAllReviews from "./customHooks/getAllReviews";
import Module from "./page/Educator/Module";

export const serverUrl =
  "http://localhost:8000";

function App() {

  getCurrentUser();

  getCreatorCourse();

  getPublishedCourse();

  getAllReviews();

  const { userData } = useSelector(
    (state) => state.user
  );

  // loading state
  if (userData === undefined) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <ScrollToTop />

      <Routes>

        {/* Public */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/signup"
          element={
            !userData
              ? <SignUp />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/login"
          element={
            !userData
              ? <Login />
              : <Navigate to="/" />
          }
        />

        {/* Protected */}
        <Route
          path="/profile"
          element={
            userData
              ? <Profile />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/forget-password"
          element={
            userData
              ? <ForgetPassword />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/editprofile"
          element={
            userData
              ? <EditProfile />
              : <Navigate to="/login" />
          }
        />

        {/* Educator */}
        <Route
          path="/dashboard"
          element={
            userData?.role === "educator"
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/courses"
          element={
            userData?.role === "educator"
              ? <Courses />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/create-course"
          element={
            userData?.role === "educator"
              ? <CreateCourse />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/edit-course/:courseId"
          element={
            userData?.role === "educator"
              ? <EditCourse />
              : <Navigate to="/login" />
          }
        />


          <Route
          path="/create-module/:courseId"
          element={
            userData?.role === "educator"
              ? <Module />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/create-lecture/:courseId/:moduleId"
          element={
            userData?.role === "educator"
              ? <CreateLecture />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/editlecture/:courseId/:moduleId/:lectureId"
          element={
            userData?.role === "educator"
              ? <EditLecture />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/viewcourse/:courseId"
          element={
            userData?.role === "educator"
              ? <ViewCourse />
              : <Navigate to="/login" />
          }
        />

        {/* Students */}
        <Route
          path="/allcourses"
          element={
            userData
              ? <AllCourses />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/viewlecture/:courseId"
          element={
            userData
              ? <ViewLecture />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/mycourses"
          element={
            userData
              ? <MyEnrolledCourses />
              : <Navigate to="/login" />
          }
        />

      </Routes>
    </>
  );
}

export default App;