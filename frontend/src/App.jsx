import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, lazy, Suspense } from "react";
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
import StudentLayout from "./components/student/StudentLayout";
import AdminLayout from "./components/admin/AdminLayout";

// Shared Components
import ScrollToTop from "./components/home/shared/ScrollToTop";

// Lazy loaded Pages
const Home = lazy(() => import("./pages/home/Home"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Login = lazy(() => import("./pages/auth/Login"));
const Profile = lazy(() => import("./pages/student/Profile"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const PurchaseHistory = lazy(() => import("./pages/student/PurchaseHistory"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const EditProfile = lazy(() => import("./pages/student/EditProfile"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const EducatorDashboard = lazy(() => import("./pages/educator/EducatorDashboard"));
const Courses = lazy(() => import("./pages/educator/Courses"));
const CreateCourse = lazy(() => import("./pages/educator/CreateCourse"));
const EditCourse = lazy(() => import("./pages/educator/EditCourse"));
const AllCourses = lazy(() => import("./pages/student/AllCourses"));
const CreateLecture = lazy(() => import("./pages/educator/CreateLecture"));
const EditLecture = lazy(() => import("./pages/educator/EditLecture"));
const ViewCourse = lazy(() => import("./pages/educator/ViewCourse"));
const ViewLecture = lazy(() => import("./pages/student/ViewLecture"));
const MyEnrolledCourses = lazy(() => import("./pages/student/MyEnrolledCourses"));
const CourseDetail = lazy(() => import("./pages/student/CourseDetail"));
const Module = lazy(() => import("./pages/educator/Module"));
const EducatorProfile = lazy(() => import("./pages/educator/Profile"));
const Graph = lazy(() => import("./pages/educator/Graph"));
const RecentEnrollment = lazy(() => import("./pages/educator/RecentEnrollment"));
const Stats = lazy(() => import("./pages/educator/Stats"));
const CoursePerformance = lazy(() => import("./pages/educator/CoursePerformance"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageCourses = lazy(() => import("./pages/admin/ManageCourses"));
const PlatformStats = lazy(() => import("./pages/admin/PlatformStats"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const CheckoutPage = lazy(() => import("./pages/student/CheckoutPage"));
const Certificates = lazy(() => import("./pages/student/Certificates"));
const BlogPanel = lazy(() => import("./pages/Blog/BlogPanal"));
const CategoryBlog = lazy(() => import("./pages/Blog/CategoryBlog"));
const Blog = lazy(() => import("./pages/Blog/Blog"));

export const serverUrl = import.meta.env.VITE_SERVER_URL;

function App() {
  const dispatch = useDispatch();
  const { userData, loading, initialLoading } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    // Critical: fetch user data immediately
    dispatch(fetchCurrentUser());
    
    // Defer non-critical data fetching to prioritize UI render
    const deferDataFetch = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          dispatch(fetchAllReviews());
        });
      } else {
        setTimeout(() => {
          dispatch(fetchAllReviews());
        }, 100);
      }
    };
    
    deferDataFetch();
  }, []);

  useEffect(() => {
    if (userData) {
      // Defer non-critical data fetching to prioritize UI render
      const deferDataFetch = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            dispatch(fetchPublishedCourses());
          });
        } else {
          setTimeout(() => {
            dispatch(fetchPublishedCourses());
          }, 100);
        }
      };
      
      deferDataFetch();
    }
    if (userData?.role === "educator") {
      const deferEducatorData = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            dispatch(fetchCreatorCourses());
          });
        } else {
          setTimeout(() => {
            dispatch(fetchCreatorCourses());
          }, 100);
        }
      };
      
      deferEducatorData();
    }
    if (userData?.role === "admin") {
      const deferAdminData = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            dispatch(fetchAllUsers());
            dispatch(fetchCourses());
            dispatch(fetchPlatformStats());
          });
        } else {
          setTimeout(() => {
            dispatch(fetchAllUsers());
            dispatch(fetchCourses());
            dispatch(fetchPlatformStats());
          }, 100);
        }
      };
      
      deferAdminData();
    }
  }, [userData]);

  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-2xl">
          Loading...
        </div>
      }>
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

        {/* Student Dashboard */}

        <Route
          path="/student"
          element={
            !userData ? (
              <Navigate to="/login" />
            ) : (
              <StudentLayout />
            )
          }
        >
          <Route index element={<Navigate to="stu-dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />

          <Route path="my-courses" element={<MyEnrolledCourses />} />

          <Route path="certificates" element={<Certificates />} />

          <Route path="purchase-history" element={<PurchaseHistory />} />

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Blog */}

        <Route
          path="/blogs"
          element={userData ? <BlogPanel /> : <Navigate to="/login" />}
        />

        <Route
          path="/blogs/:category"
          element={userData ? <CategoryBlog /> : <Navigate to="/login" />}
        />

        <Route
          path="/blogs/:category/:slug"
          element={userData ? <Blog /> : <Navigate to="/login" />}
        />

        {/* Educator redirect */}
        <Route
          path="/edu-dashboard"
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
          <Route path="dashboard" element={<EducatorDashboard />} />
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

        <Route path="/admin"
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
      </Suspense>
    </>
  );
}

export default App;
