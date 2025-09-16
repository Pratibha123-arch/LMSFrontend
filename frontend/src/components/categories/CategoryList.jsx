import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://13.233.183.81/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
      <div className="mt-2 flex gap-1 h-2 rounded overflow-hidden bg-gray-200">
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

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Explore Categories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex overflow-hidden"
            onClick={() => navigate(`/categories/${cat.name}`)}
          >
            {/* Icon / Image Section */}
            <div className="flex-shrink-0 w-32 h-32 bg-blue-50 flex items-center justify-center text-5xl text-blue-600">
              {cat.icon}
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-xl text-gray-800 mb-2">{cat.displayName}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{cat.description}</p>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p>
                  Courses: <span className="font-medium">{cat.totalCourses}</span>
                </p>
                <p>
                  Enrollments: <span className="font-medium">{cat.totalEnrollments}</span>
                </p>
                <p>
                  Avg. Rating: <span className="font-medium">{cat.averageRating}</span>
                </p>
              </div>

              {cat.levelDistribution && renderLevelBars(cat.levelDistribution)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
