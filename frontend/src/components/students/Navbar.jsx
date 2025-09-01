import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ProfileDropdown from "./ProfileDropdown";
import { assets } from "../../assets/assets";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  console.log("hhh",navigate)
  const { user } = useContext(AppContext); 
  const [showOtp, setShowOtp] = useState(false);
  console.log("ssssssss",setShowOtp)
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  // Safely check role
  const role = user?.role || "student";

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36
          border-b border-gray-500 py-4 
          ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"}`}
      >
        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="w-23 lg:w-32 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-5 text-gray-500">
          <div className="flex items-center gap-5">
            {user && (
              <>
                {role === "student" && (
                  <>
                    <Link to="/my-enrollments">My Enrollments</Link>
                    <Link to="/quiz-list">Quizzes</Link>
                    <Link to="/categories" >Categories</Link>
                  </>
                )}

                {role === "teacher" && (
                  <button onClick={() => navigate("/teacher")}>
                    Teacher Dashboard
                  </button>
                )}

                {role === "admin" && (
                  <button onClick={() => navigate("/admin")}>
                    Admin Dashboard
                  </button>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons / Profile */}
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              <button
                onClick={() => navigate("/request-otp")}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Request OTP
              </button>
              <button
                onClick={() => navigate("/verify-otp")}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowOtp(false)}
            >
              ✕
            </button>
            <RequestOtp />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
