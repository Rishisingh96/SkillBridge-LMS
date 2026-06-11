import React, { useState } from "react";

import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {

  // ============================================
  // MOBILE SIDEBAR STATE
  // ============================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex overflow-hidden">

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ========================================= */}
      {/* RIGHT SECTION */}
      {/* ========================================= */}

      <div className="flex-1 flex flex-col min-h-screen">

        {/* ===================================== */}
        {/* TOP NAVBAR */}
        {/* ===================================== */}

        <AdminNavbar
          setSidebarOpen={setSidebarOpen}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

AdminLayout.displayName = "AdminLayout";
export default AdminLayout;