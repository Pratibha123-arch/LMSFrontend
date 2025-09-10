// src/pages/teacher/TeacherDashboard.jsx
import React, { useState} from "react";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import TeacherAddCourse from "../../components/teacher/TeacherAddCourse";
import TeacherMyCourses from "../../components/teacher/TeacherMyCourses";
import TeacherStudents from "../../components/teacher/TeacherStudents";
import TeacherAddQuiz from "../../components/teacher/TeacherAddQuiz";
import TeacherMessages from "../../components/teacher/TeacherMessages";
import TeacherStats from "../../components/teacher/TeacherStats";
import QuizList from "../../components/teacher/QuizList";

const TeacherDashboard = () => {
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
        <TeacherSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
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
      <div className="flex-1 flex flex-col overflow-y-auto md:ml-64">

        {/* Mobile hamburger */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ☰ Menu
          </button>
        </div>

        {/* Content Area */}
       
            {activeTab === "stats" && <TeacherStats />}
            {activeTab === "add-course" && <TeacherAddCourse />}
            {activeTab === "my-courses" && <TeacherMyCourses />}
            {activeTab === "students" && <TeacherStudents />}
            {activeTab === "add-quiz" && <TeacherAddQuiz />}
            {activeTab === "quiz-list" && <QuizList />}
            {activeTab === "messages" && <TeacherMessages />}
         
      </div>
    </div>
  );
};

export default TeacherDashboard;
