import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProfileDropdown = () => {
  const { user, updateProfile, logout } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    whatsappNotifications: false,
    emailNotifications: false,
    profileImage: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        whatsappNotifications: user.whatsappNotifications || false,
        emailNotifications: user.emailNotifications || false,
        profileImage: user.profileImage || null,
      });

      // Auto-open edit mode if profile incomplete
      if (!user.firstName || !user.lastName) {
        setEditMode(true);
        setOpen(true);
      }
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0], // ✅ store selected image in profileImage
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();

      // Append all fields including file
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        // Skip undefined or null values
        if (value === null || value === undefined) return;

        // For file input, make sure it's a File object
        if (key === "profileImage" && value instanceof File) {
          data.append(key, value);
        }
        // For other fields, append normally
        else if (typeof value !== "object" || value instanceof Date) {
          data.append(key, value);
        }
        // For booleans or other non-string primitives, convert to string
        else {
          data.append(key, JSON.stringify(value));
        }
      });

      // Send FormData directly
      await updateProfile(data); // updateProfile should accept FormData
      setEditMode(false);
    } catch (err) {
      console.error("Profile update error:", err);
      console.log("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        className="p-1 rounded-full hover:bg-gray-200"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
  src={
    user?.profileImage
      ? `http://13.233.183.81:5000${user.profileImage}`
      : assets.user_icon || "/default-avatar.png"
  }
  alt="profile"
  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
/>

      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
          {!editMode ? (
            <>
              <div className="flex items-center space-x-3">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
              <div className="mt-3 flex justify-between">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {/* ✅ File input name changed to profileImage */}
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full border p-1 rounded"
              />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border p-1 rounded"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border p-1 rounded"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border p-1 rounded"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full border p-1 rounded"
              />
              <div className="flex items-center space-x-2">
                <label>
                  <input
                    type="checkbox"
                    name="whatsappNotifications"
                    checked={formData.whatsappNotifications}
                    onChange={handleChange}
                  />{" "}
                  WhatsApp Notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                  />{" "}
                  Email Notifications
                </label>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
