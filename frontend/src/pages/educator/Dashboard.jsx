import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GraphSection from "../../components/dashboard/GraphSection";
import ProfileCard from "../../components/dashboard/ProfileCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsCards from "../../components/dashboard/StatsCards";
import { fetchCreatorCourses } from "../../redux/slices/courseSlice";
import { serverUrl } from "../../App";
import CoursePerformanceTable from "../../components/dashboard/CoursePerformanceTable";  
import RecentEnrollments from "../../components/dashboard/RecentEnrollments";             // ✅
import TopPerformingCourse from "../../components/dashboard/TopPerformingCourse";       // ✅

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Replace your useEffect with:
  const { creatorCourseData, loading } = useSelector((state) => state.course);

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageProgress: 0,
    recentEnrollments: 0,
    enrollmentByCourse: [],
  });
  const [recentEnrollmentsList, setRecentEnrollmentsList] = useState([]);

  // Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/course/dashboard-stats`,
        { withCredentials: true }
      );
      setDashboardStats(response.data.stats);
      setRecentEnrollmentsList(response.data.recentEnrollments || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchCreatorCourses());
    fetchDashboardStats();
  }, [dispatch]);


  // Use API stats instead of calculated
  const totalCourses = dashboardStats.totalCourses;
  const totalStudents = dashboardStats.totalStudents;
  const totalEarning = dashboardStats.totalEarnings;
  const averageProgress = dashboardStats.averageProgress;
  const recentEnrollments = dashboardStats.recentEnrollments;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 md:px-8 py-6">
      <DashboardHeader
        title="Educator Dashboard"
        subtitle="Manage your courses, students and revenue"
        buttonText="Create Course"
        buttonAction={() => navigate("/courses")}
      />

      <ProfileCard userData={userData} />

      <StatsCards
        stats={{
          totalCourses,
          totalStudents,
          totalEarnings: totalEarning,
          averageProgress,
          recentEnrollments,
        }}
      />

      <GraphSection
        enrollmentByCourse={dashboardStats.enrollmentByCourse}
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