// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminCourses from "../../components/admin/AdminCourses";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminStats from "../../components/admin/AdminStats";
import AdminCategoryOverview from "../../components/admin/AdminCategoryOverview";
import AdminMessageTemplate from "../../components/admin/AdminMessageTemplate";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform top-0 left-0 w-64 bg-white border-r z-30 fixed md:relative h-full transition-transform duration-300`}
      >
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen} // pass to close on mobile link click if needed
        />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto md:ml-64">
        {/* Mobile hamburger */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ☰ Menu
          </button>
        </div>

        {activeTab === "stats" && <AdminStats />}
        {activeTab === "courses" && <AdminCourses />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "categories" && <AdminCategoryOverview />}
        {activeTab === "messages" && <AdminMessageTemplate />}
      </div>
    </div>
  );
};

export default AdminDashboard;
