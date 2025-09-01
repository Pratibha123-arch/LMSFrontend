import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const LEVELS = ["beginner", "intermediate", "advanced"];
const SORT_FIELDS = [
  { label: "Newest", value: "createdAt" },
  { label: "Title", value: "title" },
  { label: "Price", value: "price" },
  { label: "Rating", value: "rating.average" },
  { label: "Enrollments", value: "enrollmentCount" },
];

const CategoryDetails = ({ categoryName, onClose }) => {
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
          limit: 5,
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
  const handleLevelChange = (e) => {
    setLevelFilter(e.target.value);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleSortChange = (e) => setSortBy(e.target.value);
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);

  if (loading) return <div className="p-4">Loading courses...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="mt-6 border-t pt-4">
      <button
        onClick={onClose}
        className="mb-4 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
      >
        Back to Categories
      </button>

      <h2 className="text-xl font-bold mb-2">
        Courses in {category?.displayName}
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-start">
        {/* Level Filter */}
        <div>
          <label className="mr-2 font-semibold">Level:</label>
          <select
            value={levelFilter}
            onChange={handleLevelChange}
            className="border px-2 py-1 rounded"
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
        <div>
          <label className="mr-2 font-semibold">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title"
            className="border px-2 py-1 rounded"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="mr-2 font-semibold">Sort by:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border px-2 py-1 rounded mr-2"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="border px-2 py-1 rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.length === 0 && (
          <div className="col-span-full text-gray-500">
            No courses found.
          </div>
        )}
        {courses.map((course) => (
          <div key={course._id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-gray-600">
              Teacher: {course.teacher?.firstName} {course.teacher?.lastName}
            </p>
            <p className="text-sm">Price: ${course.price}</p>
            <p className="text-sm">Enrollments: {course.enrollmentCount}</p>
            <p className="text-sm">Rating: {course.rating?.average || 0}</p>
            <p className="text-sm">Level: {course.level}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {courses.length > 0 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            disabled={!pagination.hasPrevPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded">
            Page {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
