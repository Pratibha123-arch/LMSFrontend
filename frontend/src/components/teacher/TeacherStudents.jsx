// src/pages/student/StudentProgress.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const StudentProgress = () => {
  const { token } = useContext(AppContext);

  const [progressRecords, setProgressRecords] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "", // completed, in-progress, not-started
    page: 1,
    limit: 10,
  });

  // Fetch progress
  const fetchProgress = async () => {
    try {
      setLoading(true);

      const queryParams = {};
      if (filters.status) queryParams.status = filters.status;
      queryParams.page = filters.page;
      queryParams.limit = filters.limit;

      const query = new URLSearchParams(queryParams).toString();

      const res = await axios.get(
        `http://13.233.183.81/api/progress?${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProgressRecords(res.data.data.progress || []);
      setPagination(res.data.data.pagination || {});
    } catch (err) {
      console.error("Error fetching progress:", err.response?.data || err);
      // alert("Failed to fetch progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Course Progress</h2>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="not-started">Not Started</option>
        </select>
      </div>

      {/* Progress Table */}
      {loading ? (
        <p>Loading progress...</p>
      ) : progressRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Course</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Level</th>
                <th className="border px-4 py-2">Progress</th>
                <th className="border px-4 py-2">Last Accessed</th>
              </tr>
            </thead>
            <tbody>
              {progressRecords.map((record) => (
                <tr key={record._id} className="text-sm">
                  <td className="border px-4 py-2">{record.course?.title}</td>
                  <td className="border px-4 py-2">{record.course?.category}</td>
                  <td className="border px-4 py-2">{record.course?.level}</td>
                  <td className="border px-4 py-2">
                    {record.overallProgress || 0}%
                  </td>
                  <td className="border px-4 py-2">
                    {record.lastAccessedAt
                      ? new Date(record.lastAccessedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No progress records found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          disabled={pagination.currentPage <= 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          disabled={pagination.currentPage >= pagination.totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentProgress;
