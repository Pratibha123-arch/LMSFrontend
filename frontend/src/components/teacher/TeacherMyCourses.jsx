// src/pages/teacher/TeacherMyCourses.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const TeacherMyCourses = () => {
  const { token, user } = useContext(AppContext); // user._id = teacherId
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
  });

  const startEdit = (course) => {
    setEditingCourseId(course._id);
    setEditForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
    });
  };

  const cancelEdit = () => setEditingCourseId(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (courseId) => {
    try {
      const res = await axios.put(
        `http://13.233.183.81/api/courses/${courseId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? res.data.data : c))
      );
      setEditingCourseId(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };


  const handleDelete = async (courseId) => {
  if (!window.confirm("Are you sure you want to delete this course?")) return;

  try {
    await axios.delete(`http://13.233.183.81/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Remove the deleted course from state
    setCourses(prev => prev.filter(c => c._id !== courseId));
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
};

const handleTogglePublish = async (courseId) => {
  try {
    const res = await axios.patch(
      `http://13.233.183.81/api/courses/${courseId}/publish`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCourses(prev =>
      prev.map(c =>
        c._id === courseId
          ? { ...c, isPublished: res.data.data.isPublished, publishedAt: res.data.data.publishedAt }
          : c
      )
    );
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
};
  const fetchCourses = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://13.233.183.81/api/courses/teacher/${user.id}?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(res.data.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id, token]);

  if (loading) return <p className="text-center">Loading your courses...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!courses.length) return <p className="text-center">No courses found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="p-4 border rounded shadow hover:shadow-lg transition bg-white"
          >
            {editingCourseId === course._id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                  placeholder="Description"
                />
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
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
                <select
                  name="level"
                  value={editForm.level}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                >
                  {["beginner", "intermediate", "advanced"].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                  placeholder="Price"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(course._id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Category: {course.category} | Level: {course.level}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Price: ${course.price} | Duration: {course.duration} mins
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Created At: {new Date(course.createdAt).toLocaleDateString()}
                </p>
               <div className="flex gap-2 mt-2">
  <button
    onClick={() => startEdit(course)}
    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(course._id)}
    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
  >
    Delete
  </button>

  <button
    onClick={() => handleTogglePublish(course._id)}
    className={`px-3 py-1 rounded transition ${
      course.isPublished ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
    } text-white`}
  >
    {course.isPublished ? 'Unpublish Course' : 'Publish Course'}
  </button>
</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherMyCourses;
