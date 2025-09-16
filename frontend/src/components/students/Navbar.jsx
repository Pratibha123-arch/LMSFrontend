import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ProfileDropdown from "./ProfileDropdown";
import { assets } from "../../assets/assets";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const role = user?.role || "student";

  return (
    <nav
      className={`relative border-b border-gray-500 
      ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"}`}
    >
      <div className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="w-24 lg:w-32 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">
          {user && (
            <>
              {role === "student" && (
                <>
                  <Link to="/my-enrollments">My Enrollments</Link>
                  <Link to="/quiz-list">Quizzes</Link>
                  <Link to="/categories">Categories</Link>
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

          {user ? (
            <ProfileDropdown />
          ) : (
            <button
              onClick={() => navigate("/request-otp")}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Request OTP
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-300 px-4 py-3 space-y-3">
          {user && (
            <>
              {role === "student" && (
                <div className="flex flex-col space-y-2">
                  <Link to="/my-enrollments" onClick={() => setMobileOpen(false)}>
                    My Enrollments
                  </Link>
                  <Link to="/quiz-list" onClick={() => setMobileOpen(false)}>
                    Quizzes
                  </Link>
                  <Link to="/categories" onClick={() => setMobileOpen(false)}>
                    Categories
                  </Link>
                </div>
              )}
              {role === "teacher" && (
                <button
                  onClick={() => {
                    navigate("/teacher");
                    setMobileOpen(false);
                  }}
                >
                  Teacher Dashboard
                </button>
              )}
              {role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMobileOpen(false);
                  }}
                >
                  Admin Dashboard
                </button>
              )}
            </>
          )}

          {user ? (
            <ProfileDropdown />
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/request-otp");
                  setMobileOpen(false);
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
              >
                Request OTP
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
