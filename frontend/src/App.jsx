import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/students/Loading";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Navbar from "./components/students/Navbar";
import ProfileDropdown from "./components/students/ProfileDropdown";

import RequestOtp from "./components/students/RequestOtp";
import VerifyOtp from "./components/students/VerifyOtp";
import Quizzes from "./components/students/Quizzes";
import QuizList from "./pages/student/QuizList";
import QuizPage from "./pages/student/QuizPage";
import QuizResult from "./pages/student/QuizResult";

import AdminCourses from "./components/admin/AdminCourses";
import AdminUsers from "./components/admin/AdminUsers";
import AdminStats from "./components/admin/AdminStats";
import TeacherDetails from "./pages/admin/TeacherDetails";
import CategoryList from "./components/categories/CategoryList";
import CategoryDetails from "./components/categories/CategoryDetails";
import AdminCategoryOverview from "./components/admin/AdminCategoryOverview";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// ✅ Import ProtectedRoute
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  const isTeacherRoute = useMatch("/teacher/*");

  return (
    <div className="text-default min-h-screen bg-white">
      {/* Show Navbar always (you can hide for teacher/admin if you want) */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input?" element={<CoursesList />} />
       <Route
  path="/course/:id"
  element={
    <ProtectedRoute roles={["student", "teacher", "admin"]}>
      <CourseDetails />
    </ProtectedRoute>
  }
/>
        <Route path="/request-otp" element={<RequestOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile-dropdown" element={<ProfileDropdown />} />
        <Route path="/quizzes" element={<Quizzes />} />

        {/* ✅ Protected Student routes */}
        <Route
          path="/my-enrollments"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyEnrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:courseId"
          element={
            <ProtectedRoute roles={["student"]}>
              <Player />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-list"
          element={
            <ProtectedRoute roles={["student"]}>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute roles={["student"]}>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id/result"
          element={
            <ProtectedRoute roles={["student"]}>
              <QuizResult />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminStats />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategoryOverview />} />
        </Route>
        <Route
          path="/admin/teachers/:id"
          element={
            <ProtectedRoute roles={["admin"]}>
              <TeacherDetails />
            </ProtectedRoute>
          }
        />

       
        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

<Route
  path="/categories"
  element={
    <ProtectedRoute roles={["student", "teacher", "admin"]}>
      <CategoryList />
    </ProtectedRoute>
  }
/>
<Route
  path="/categories/:categoryName"
  element={
    <ProtectedRoute roles={["student", "teacher", "admin"]}>
      <CategoryDetails />
    </ProtectedRoute>
  }
/>


        {/* Utility */}
        <Route path="/loading/:path" element={<Loading />} />
      </Routes>
    </div>
  );
};

export default App;
