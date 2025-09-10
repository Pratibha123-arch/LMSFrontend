import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/students/Loading";
// import Teacher from "./pages/teacher/Teacher";
// import Dashboard from "./pages/teacher/Dashboard";
// import AddCourse from "./pages/teacher/AddCourse";
// import MyCourses from "./pages/teacher/MyCourses";
// import MessageTemplate from "./pages/teacher/MessageTemplate";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import StudentEnrolled from "./pages/teacher/StudentEnrolled";
import Navbar from "./components/students/Navbar";
import ProfileDropdown from "./components/students/ProfileDropdown";

import RequestOtp from "./components/students/RequestOtp";
import VerifyOtp from "./components/students/VerifyOtp";
import Quizzes  from "./components/students/Quizzes";
// import AddQuiz from "./pages/teacher/AddQuiz"; 
import QuizList from './pages/student/QuizList';
import QuizPage from './pages/student/QuizPage';
import QuizResult from './pages/student/QuizResult';

import AdminCourses from "./components/admin/AdminCourses";
import AdminUsers from "./components/admin/AdminUsers";
import AdminStats from "./components/admin/AdminStats";
import AdminSidebar from "./components/admin/AdminSidebar";
import TeacherDetails from "./pages/admin/TeacherDetails";
import CategoryList from "./components/categories/CategoryList";
import CategoryDetails from "./components/categories/CategoryDetails";
import AdminCategoryOverview from "./components/admin/AdminCategoryOverview";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";


// import QuizSubmit from "./pages/teacher/QuizSubmit"
// import QuizzesList from "./pages/student/QuizzesList";

const App = () => {
  const isTeacherRoute = useMatch("/teacher/*");

  return (
    <div className="text-default min-h-screen bg-white">
      {/* Show Navbar only if NOT in educator route */}
      {/* {!isTeacherRoute && <Navbar />} */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input?" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        
          <Route path="/quiz-list" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/quiz/:id/result" element={<QuizResult />} />

        <Route path="/request-otp" element={<RequestOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile-dropdown" element={<ProfileDropdown />} />
        <Route path="/quizzes" element={<Quizzes />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminStats />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategoryOverview />} />
           </Route>
        <Route path="/admin/teachers/:id" element={<TeacherDetails />} />
         <Route path="/teacher" element={<TeacherDashboard />} />

        {/* <Route path="/teacher" element={<Teacher />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
           <Route path="add-quiz" element={<AddQuiz />} />
           <Route path="messages" element={<MessageTemplate />} />

        </Route> */}
      

         {/* Categories */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/:categoryName" element={<CategoryDetails />} />

      </Routes>
    </div>
  );
};

export default App;
