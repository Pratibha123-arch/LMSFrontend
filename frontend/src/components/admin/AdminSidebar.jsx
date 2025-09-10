import React from "react";
import { BarChart3, BookOpen, Users } from "lucide-react";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "stats", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { id: "courses", label: "Manage Courses", icon: <BookOpen size={20} /> },
    { id: "users", label: "Manage Users", icon: <Users size={20} /> },
    { id: "categories", label: "Manage Categories", icon: <Users size={20} /> },
    { id: "messages", label: "Message Template", icon: <Users size={20} /> }
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-indigo-600">Admin Panel</h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              activeTab === item.id
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
