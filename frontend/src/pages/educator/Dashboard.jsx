import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import GraphSection from "../../components/dashboard/GraphSection";
import ProfileCard from "../../components/dashboard/ProfileCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsCards from "../../components/dashboard/StatsCards";
import { fetchCreatorCourses } from "../../redux/slices/courseSlice";
import { fetchDashboardStats } from "../../redux/slices/dashboardSlice";
import CoursePerformanceTable from "../../components/dashboard/CoursePerformanceTable";
import RecentEnrollments from "../../components/dashboard/RecentEnrollments";
import TopPerformingCourse from "../../components/dashboard/TopPerformingCourse";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { creatorCourseData } = useSelector((state) => state.course);
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchCreatorCourses());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const totalCourses = stats.totalCourses;
  const totalStudents = stats.totalStudents;
  const totalEarning = stats.totalEarnings;
  const averageProgress = stats.averageProgress;
  const recentEnrollments = stats.recentEnrollments;
  const totalDownloads = stats.totalDownloads;
  const enrollmentByCourse = stats.enrollmentByCourse;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 md:px-8 py-6">
      <DashboardHeader
        title="Educator Dashboard"
        subtitle="Manage your courses, students and revenue"
        buttonText="Create Course"
        buttonAction={() => navigate("/educator/courses")}
      />

      <ProfileCard userData={userData} totalEarnings={totalEarning} />

      <StatsCards
        stats={{
          totalCourses,
          totalStudents,
          totalEarnings: totalEarning,
          averageProgress,
          recentEnrollments,
          totalDownloads,
        }}
      />

      <GraphSection
        enrollmentByCourse={enrollmentByCourse}
        creatorCourseData={creatorCourseData}
      />

      <CoursePerformanceTable />

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mb-10">
        <RecentEnrollments />
        <TopPerformingCourse />
      </div>
    </div>
  );
};

export default Dashboard;