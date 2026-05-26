import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

// Redux
import { fetchCurrentUser } from "./redux/slices/userSlice";
import { fetchCreatorCourses, fetchPublishedCourses } from "./redux/slices/courseSlice";
import { fetchAllReviews } from "./redux/slices/reviewSlice";

// Pages
import Home from "./pages/student/Home";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Profile from "./pages/student/Profile";
import ForgetPassword from "./pages/auth/ForgetPassword";
import EditProfile from "./pages/student/EditProfile";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Dashboard from "./pages/educator/Dashboard";
import Courses from "./pages/educator/Courses";
import CreateCourse from "./pages/educator/CreateCourse";
import EditCourse from "./pages/educator/EditCourse";
import AllCourses from "./pages/student/AllCourses";
import CreateLecture from "./pages/educator/CreateLecture";
import EditLecture from "./pages/educator/EditLecture";
import ViewCourse from "./pages/educator/ViewCourse";
import ScrollToTop from "./components/common/ScrollToTop";
import ViewLecture from "./pages/student/ViewLecture";
import MyEnrolledCourses from "./pages/student/MyEnrolledCourses";
import CourseDetail from "./pages/student/CourseDetail";
import Module from "./pages/educator/Module";

export const serverUrl = import.meta.env.VITE_SERVER_URL;

function App() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);

  // ── App Load pe fetch ──────────────────────
  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchAllReviews());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      dispatch(fetchPublishedCourses());
    }
    if (userData?.role === "educator") {
      dispatch(fetchCreatorCourses());
    }
  }, [dispatch, userData]);

  // Loading state
  if (loading) {
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
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />

        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to="/login" />}
        />

        {/* Educator */}
        <Route
          path="/dashboard"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <Dashboard /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/courses"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <Courses /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/create-course"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <CreateCourse /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/edit-course/:courseId"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <EditCourse /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/create-module/:courseId"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <Module /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/create-lecture/:courseId/:moduleId"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <CreateLecture /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/editlecture/:courseId/:moduleId/:lectureId"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <EditLecture /> :
            <Navigate to="/" />
          }
        />

        <Route
          path="/viewcourse/:courseId"
          element={
            !userData ? <Navigate to="/login" /> :
            userData?.role === "educator" ? <ViewCourse /> :
            <Navigate to="/" />
          }
        />

        {/* Students */}
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to="/login" />}
        />

        <Route
          path="/course/:courseId"
          element={userData ? <CourseDetail /> : <Navigate to="/login" />}
        />

        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLecture /> : <Navigate to="/login" />}
        />

        <Route
          path="/mycourses"
          element={userData ? <MyEnrolledCourses /> : <Navigate to="/login" />}
        />

      </Routes>
    </>
  );
}

export default App;