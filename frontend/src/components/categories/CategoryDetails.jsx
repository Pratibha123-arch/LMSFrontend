import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://13.233.183.81/api";
const LEVELS = ["beginner", "intermediate", "advanced"];
const SORT_FIELDS = [
  { label: "Newest", value: "createdAt" },
  { label: "Title", value: "title" },
  { label: "Price", value: "price" },
  { label: "Rating", value: "rating.average" },
  { label: "Enrollments", value: "enrollmentCount" },
];

const CategoryDetails = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchCategoryDetails = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/categories/${categoryName}`, {
        params: {
          page,
          limit: 6,
          level: levelFilter || undefined,
          sortBy,
          sortOrder,
          title: searchTerm || undefined,
        },
      });
      setCategory(res.data.data.category);
      setCourses(res.data.data.courses);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails(page);
  }, [categoryName, page, levelFilter, searchTerm, sortBy, sortOrder]);

  const handlePageChange = (newPage) => setPage(newPage);

  if (loading) return <div className="p-6 text-center">Loading courses...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/categories")}
        className="mb-6 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
      >
        ← Back to Categories
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Courses in {category?.displayName}
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm">
        {/* Level */}
        <div>
          <label className="mr-2 font-medium">Level:</label>
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
          >
            <option value="">All</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title"
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="asc">⬆ Asc</option>
            <option value="desc">⬇ Desc</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No courses found.
          </div>
        )}
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex overflow-hidden"
          >
            {/* Course Image */}
            <div className="flex-shrink-0 w-40 h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
              📚
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{course.teacher?.firstName} {course.teacher?.lastName}</p>
                <p className="text-sm text-gray-600 mb-1">💲 ${course.price}</p>
                <p className="text-sm text-gray-600 mb-1">👥 {course.enrollmentCount} enrolled</p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-white text-xs ${
                  course.level === "beginner"
                    ? "bg-green-500"
                    : course.level === "intermediate"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}>
                  {course.level}
                </span>
                <span className="text-sm text-gray-700">⭐ {course.rating?.average || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {courses.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="px-4 py-2 border rounded-lg">
            Page {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
