import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/teacher/Navbar.jsx";
import Sidebar from "../../components/teacher/Sidebar.jsx";
import Footer from "../../components/teacher/Footer.jsx";

const Teacher = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Outlet /> {/* Nested routes render here */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teacher;
