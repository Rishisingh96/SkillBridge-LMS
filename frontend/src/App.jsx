import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

// Redux
import { fetchCurrentUser } from "./redux/slices/userSlice";
import {
  fetchCreatorCourses,
  fetchPublishedCourses,
} from "./redux/slices/courseSlice";
import { fetchAllReviews } from "./redux/slices/reviewSlice";
import {
  fetchAllUsers,
  fetchCourses,
  fetchPlatformStats,
} from "./redux/slices/adminSlice";

// Layouts
import EducatorLayout from "./components/educator/EducatorLayout";

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
import EducatorProfile from "./pages/educator/Profile";
import Graph from "./pages/educator/Graph";
import RecentEnrollment from "./pages/educator/RecentEnrollment";
import Stats from "./pages/educator/Stats";
import CoursePerformance from "./pages/educator/CoursePerformance";

import AdminLayout from "./components/admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";

import ManageUsers from "./pages/admin/ManageUsers";

import ManageCourses from "./pages/admin/ManageCourses";

import PlatformStats from "./pages/admin/PlatformStats";
import AdminCoupons from "./pages/admin/Coupons";
import CheckoutPage from "./pages/student/CheckoutPage";

export const serverUrl = import.meta.env.VITE_SERVER_URL;

function App() {
  const dispatch = useDispatch();
  const { userData, loading, initialLoading } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchAllReviews());
  }, []);

  useEffect(() => {
    if (userData) {
      dispatch(fetchPublishedCourses());
    }
    if (userData?.role === "educator") {
      dispatch(fetchCreatorCourses());
    }
    if (userData?.role === "admin") {
      dispatch(fetchAllUsers());
      dispatch(fetchCourses());
      dispatch(fetchPlatformStats());
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-2xl">
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
          element={
            !userData ? (
              <SignUp />
            ) : userData?.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : userData?.role === "educator" ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        /> */}

        {/* <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} /> */}

        <Route
          path="/login"
          element={
            !userData ? (
              <Login />
            ) : userData?.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : userData?.role === "educator" ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected - Student */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to="/login" />}
        />
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

        <Route path="/checkout/:courseId" element={<CheckoutPage />} />

        {/* Educator redirect */}
        <Route
          path="/dashboard"
          element={
            !userData ? (
              <Navigate to="/login" />
            ) : userData?.role === "educator" ? (
              <Navigate to="/educator/profile" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Educator - nested under EducatorLayout with sidebar */}
        <Route
          path="/educator"
          element={
            !userData ? (
              <Navigate to="/login" />
            ) : userData?.role === "educator" ? (
              <EducatorLayout />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<Navigate to="profile" replace />} />

          <Route path="profile" element={<EducatorProfile />} />
          <Route path="graph" element={<Graph />} />
          <Route path="recent-enrollment" element={<RecentEnrollment />} />
          <Route path="stats" element={<Stats />} />
          <Route path="course-performance" element={<CoursePerformance />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseId" element={<EditCourse />} />
          <Route path="create-module/:courseId" element={<Module />} />
          <Route
            path="create-lecture/:courseId/:moduleId"
            element={<CreateLecture />}
          />
          <Route
            path="editlecture/:courseId/:moduleId/:lectureId"
            element={<EditLecture />}
          />
          <Route path="viewcourse/:courseId" element={<ViewCourse />} />
        </Route>

        {/* Admin redirect */}

        {/* ======================================== */}
        {/* ADMIN ROUTES */}
        {/* ======================================== */}

        <Route
          path="/admin"
          element={
            !userData ? (
              <Navigate to="/login" />
            ) : userData?.role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          {/* DEFAULT */}

          <Route index element={<Navigate to="dashboard" replace />} />

          {/* DASHBOARD */}

          <Route path="dashboard" element={<AdminDashboard />} />

          {/* USERS */}

          <Route path="users" element={<ManageUsers />} />

          {/* COURSES */}

          <Route path="courses" element={<ManageCourses />} />

          {/* COUPONS */}

          <Route path="coupons" element={<AdminCoupons />} />

          {/* STATS */}

          <Route path="stats" element={<PlatformStats />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
