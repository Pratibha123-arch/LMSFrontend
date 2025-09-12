import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryDetails from "./CategoryDetails";

const API_BASE = "http://13.233.183.81/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/categories`, {
        params: { includeStats: true, sortBy: "name", sortOrder: "asc" },
      });
      setCategories(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderLevelBars = (levelDistribution) => {
    const total =
      (levelDistribution.beginner || 0) +
      (levelDistribution.intermediate || 0) +
      (levelDistribution.advanced || 0);

    if (total === 0) return null;

    return (
      <div className="mt-3 flex gap-1 h-2 rounded overflow-hidden bg-gray-200">
        {["beginner", "intermediate", "advanced"].map((lvl) => {
          const count = levelDistribution[lvl] || 0;
          const widthPercent = (count / total) * 100;
          const color =
            lvl === "beginner"
              ? "bg-green-500"
              : lvl === "intermediate"
              ? "bg-yellow-500"
              : "bg-blue-500";
          return (
            <div
              key={lvl}
              style={{ width: `${widthPercent}%` }}
              className={`${color} transition-all`}
              title={`${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${count}`}
            ></div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return <div className="p-6 text-center text-lg">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Explore Categories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 cursor-pointer group"
            onClick={() => setSelectedCategory(cat.name)}
          >
            {/* Icon */}
            <div className="text-5xl mb-3 text-blue-600 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>

            {/* Title */}
            <h2 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600">
              {cat.displayName}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {cat.description}
            </p>

            {/* Stats */}
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>
                Courses:{" "}
                <span className="font-medium">{cat.totalCourses}</span>
              </p>
              <p>
                Enrollments:{" "}
                <span className="font-medium">{cat.totalEnrollments}</span>
              </p>
              <p>
                Avg. Rating:{" "}
                <span className="font-medium">{cat.averageRating}</span>
              </p>
            </div>

            {/* Visual Level Distribution */}
            {cat.levelDistribution && renderLevelBars(cat.levelDistribution)}
          </div>
        ))}
      </div>

      {/* Category Details Modal/Drawer */}
      {selectedCategory && (
        <CategoryDetails
          categoryName={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default CategoryList;
