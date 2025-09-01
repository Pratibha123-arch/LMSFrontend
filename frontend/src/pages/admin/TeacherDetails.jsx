// src/pages/admin/TeacherDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const TeacherDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination for courses
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const totalPages = Math.ceil(courses.length / limit);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:500/api/admin/teachers/${teacherId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { teacher, courses } = res.data.data; // destructure backend response
        setTeacher(teacher);
        setCourses(Array.isArray(courses) ? courses : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch teacher details or courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, token]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!teacher) return <p className="p-6">Teacher not found.</p>;

  // Pagination slice
  const paginatedCourses = courses.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/admin/teachers")}
      >
        ← Back to Teachers
      </button>

      {/* Teacher Info */}
      <h2 className="text-2xl font-bold mb-2">{teacher.fullName}</h2>
      <p className="mb-1">Email: {teacher.email}</p>
      <p className="mb-4">Status: {teacher.isActive ? "Active" : "Inactive"}</p>

      {/* Courses Table */}
      <h3 className="text-xl font-semibold mb-2">Courses</h3>
      {paginatedCourses.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Published</th>
              <th className="border p-2">Enrollments</th>
              <th className="border p-2">Completions</th>
              <th className="border p-2">Avg. Progress</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.map(course => (
              <tr key={course._id}>
                <td className="border p-2">{course.title}</td>
                <td className="border p-2">{course.isPublished ? "Yes" : "No"}</td>
                <td className="border p-2">{course.enrollmentStats?.totalEnrollments || 0}</td>
                <td className="border p-2">{course.enrollmentStats?.completedEnrollments || 0}</td>
                <td className="border p-2">{Math.round(course.enrollmentStats?.averageProgress || 0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No courses found for this teacher.</p>
      )}

      {/* Courses Pagination */}
      {courses.length > limit && (
        <div className="flex gap-2 mt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherDetails;
