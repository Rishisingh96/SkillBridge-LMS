import React from "react";
import Nav from "../../components/navbar/Navbar";
import StatsCards from "../../components/studentDashboard/StatsCards";
import ContinueLearning from "../../components/studentDashboard/ContinueLearning";
import LearningStreak from "../../components/studentDashboard/LearningStreak";
import TopBanner from "../../components/studentDashboard/TopBanner";
import Calendar from "../../components/studentDashboard/Calendar";
import Leaderboard from "../../components/studentDashboard/Leaderboard";

const Dashboard = () => {
  return (
    <>
      <Nav />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen pt-[90px]">
      <TopBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <StatsCards />
          <ContinueLearning />
        </div>
        
        <div className="space-y-6">
          <LearningStreak />
          <Calendar />
          <Leaderboard />
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
