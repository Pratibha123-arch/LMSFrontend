import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loading from "../../components/students/Loading";

const MyCourses = () => {
  const { currency, allCourses, user, token, fetchAllCourses } =
    useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [error, setError] = useState(null);
  const [loadingPublish, setLoadingPublish] = useState(null);

  useEffect(() => {
    if (!allCourses) return;
    let filtered = allCourses;
    if (user?.role === "teacher") {
      filtered = allCourses.filter((c) => c.teacher?._id === user._id);
    }
    setCourses(filtered);
  }, [allCourses, user]);

  const handleEditClick = (course) => {
    setEditingCourse({
      ...course,
      title: course.title || "",
      description: course.description || "",
      category: course.category || "programming",
      level: course.level || "beginner",
      price: course.price || 0,
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setError(null);

    try {
      await axios.put(
        `http://13.233.183.81/api/courses/${editingCourse._id}`,
        {
          title: editingCourse.title,
          description: editingCourse.description,
          category: editingCourse.category,
          level: editingCourse.level,
          price: parseFloat(editingCourse.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAllCourses();
      setEditingCourse(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Delete course
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoadingDelete(courseId);

    try {
      await axios.delete(`http://13.233.183.81/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchAllCourses();
    } catch (err) {
      console.log(err)
      // alert(err.response?.data?.message || "Failed to delete course");
    } finally {
      setLoadingDelete(null);
    }
  };

  const togglePublish = async (id) => {
    try {
      setLoadingPublish(id);
      await axios.patch(
        `http://13.233.183.81/api/courses/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllCourses(); // refresh courses
    } catch (error) {
      console.log(error)
      // alert(error.response?.data?.message || "Failed to toggle publish status");
    } finally {
      setLoadingPublish(null);
    }
  };
  return courses ? (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Courses</h2>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-900 border-b">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Earnings</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Published On</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={course.thumbnail || "/default-thumbnail.png"}
                        alt="Course"
                        className="w-16 h-12 object-cover rounded-md shadow-sm"
                      />
                      <span className="truncate">
                        {course.title || "Untitled"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {currency}
                      {(course.enrollmentCount || 0) * (course.price || 0)}
                    </td>
                    <td className="px-4 py-3">
                      {course.enrolledStudents?.length ??
                        course.enrollmentCount ??
                        0}
                    </td>
                    <td className="px-4 py-3">
                      {course.createdAt
                        ? new Date(course.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                        onClick={() => handleEditClick(course)}
                      >
                        Update
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                        onClick={() => handleDelete(course._id)}
                        disabled={loadingDelete === course._id}
                      >
                        {loadingDelete === course._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                      <button
                        onClick={() => togglePublish(course._id)}
                        disabled={loadingPublish === course._id}
                        className={`px-3 py-1 rounded-md text-white ${
                          course.isPublished
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {loadingPublish === course._id
                          ? "Processing..."
                          : course.isPublished
                          ? "Unpublish"
                          : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-400 italic"
                  >
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Course Modal */}
        {editingCourse && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Update Course
              </h3>
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Title</label>
                  <input
                    name="title"
                    value={editingCourse.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editingCourse.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={editingCourse.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                      required
                    >
                      {[
                        "programming",
                        "design",
                        "business",
                        "marketing",
                        "photography",
                        "music",
                        "health",
                        "language",
                        "other",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-1">Level</label>
                    <select
                      name="level"
                      value={editingCourse.level}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                      required
                    >
                      {["beginner", "intermediate", "advanced"].map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editingCourse.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                    required
                    min={0}
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    onClick={() => setEditingCourse(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    disabled={loadingUpdate}
                  >
                    {loadingUpdate ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
