// src/components/admin/AdminCategoryOverview.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AdminCategoryOverview = () => {
  const { token } = useContext(AppContext);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/categories/stats/overview",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOverview(res.data.data);
      } catch (err) {
        console.error("Error fetching admin overview", err);
      }
    };
    fetchOverview();
  }, [token]);

  if (!overview) return <p className="text-center">Loading admin stats...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">📊 Category Stats Overview</h2>
      <p>Total Categories: {overview.totalCategories}</p>
      <p>Categories With Courses: {overview.categoriesWithCourses}</p>
      <p>
        Most Popular: {overview.mostPopularCategory?.displayName} (
        {overview.mostPopularCategory?.totalEnrollments} enrollments)
      </p>

      <h3 className="mt-4 font-semibold">Category Distribution</h3>
      <ul className="mt-2 space-y-2">
        {overview.categoryDistribution.map((cat) => (
          <li
            key={cat.name}
            className="p-2 border rounded-md shadow-sm bg-gray-50"
          >
            {cat.icon} {cat.displayName} — {cat.totalCourses} courses,{" "}
            {cat.totalEnrollments} enrollments
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategoryOverview;
