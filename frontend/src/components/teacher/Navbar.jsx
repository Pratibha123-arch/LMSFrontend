import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import React from "react";
import ProfileDropdown from "../../components/students/ProfileDropdown";

const Navbar = () => {
  const { user, setUser, setToken } = React.useContext(AppContext);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-20 h-auto" />
      </Link>

      <div className="flex items-center gap-5 text-gray-500 relative">
        <p className="!p-0">Hi! {user ? user.fullName : "Developers"}</p>
        {user ? (
          <ProfileDropdown user={user} onLogout={handleLogout} />
        ) : (
          <img className="w-10 h-10 rounded-full" src={assets.profile_img} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
