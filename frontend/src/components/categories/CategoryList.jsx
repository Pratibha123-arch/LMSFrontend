import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryDetails from "./CategoryDetails";

const API_BASE = "http://localhost:5000/api";

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
      <div className="mt-2 flex gap-1 h-3 rounded overflow-hidden">
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
              className={`${color}`}
              title={`${lvl.charAt(0).toUpperCase() + lvl.slice(1)}: ${count}`}
            ></div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedCategory(cat.name)}
          >
            <div className="text-4xl">{cat.icon}</div>
            <h2 className="font-bold text-lg mt-2">{cat.displayName}</h2>
            <p className="text-sm text-gray-600">{cat.description}</p>
            <p className="mt-2 text-sm">
              Courses: {cat.totalCourses} | Enrollments: {cat.totalEnrollments}
            </p>
            <p className="text-sm">Avg. Rating: {cat.averageRating}</p>

            {/* Visual Level Distribution */}
            {cat.levelDistribution && renderLevelBars(cat.levelDistribution)}
          </div>
        ))}
      </div>

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
