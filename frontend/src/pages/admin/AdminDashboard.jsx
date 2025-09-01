// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminCourses from "../../components/admin/AdminCourses";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminStats from "../../components/admin/AdminStats";
import AdminCategoryOverview from "../../components/admin/AdminCategoryOverview";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "stats" && <AdminStats />}
        {activeTab === "courses" && <AdminCourses />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "categories" && <AdminCategoryOverview />}
      </div>
    
    </div>
  );
};

export default AdminDashboard;
