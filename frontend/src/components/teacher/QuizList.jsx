// src/pages/teacher/QuizList.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const QuizList = () => {
  const { token } = useContext(AppContext);

  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [quizDetails, setQuizDetails] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  // For update mode
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    difficulty: "medium",
  });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    published: "true",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 6,
  });

  const fetchQuizById = async (id) => {
    try {
      const res = await axios.get(`http://13.233.183.81/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizDetails(res.data.data);
    } catch (err) {
      console.error("Error fetching quiz:", err.response?.data || err);
      console.log("Failed to fetch quiz");
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();

      const res = await axios.get(`http://13.233.183.81/api/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuizzes(res.data.data.quizzes || []);
      setPagination(res.data.data.pagination || {});
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchQuizStats = async (id) => {
    try {
      setStatsLoading(true);
      const res = await axios.get(
        `http://13.233.183.81/api/quizzes/${id}/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuizStats({ id, data: res.data.data }); // store stats by quiz id
    } catch (err) {
      console.error("Error fetching quiz stats:", err.response?.data || err);
      // console.log(err.response?.data?.message || "Failed to fetch quiz stats");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  // Handle update form changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save update
  const handleUpdateQuiz = async (id) => {
    try {
      await axios.put(`http://13.233.183.81/api/quizzes/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quiz updated successfully");
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error("Error updating quiz:", err.response?.data || err);
      // alert(err.response?.data?.message || "Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`http://13.233.183.81/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(" Quiz deleted successfully");
      fetchQuizzes(); 
    } catch (err) {
      console.error("Error deleting quiz:", err.response?.data || err);
      // alert(err.response?.data?.message || "Failed to delete quiz");
    }
  };

  // inside QuizList.jsx
  const handleTogglePublish = async (id) => {
    try {
      const res = await axios.patch(
        `http://13.233.183.81/api/quizzes/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // alert(res.data.message);

      // Update quiz state locally without refetching all quizzes
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz._id === id
            ? {
                ...quiz,
                isPublished: res.data.data.isPublished,
                publishedAt: res.data.data.publishedAt,
              }
            : quiz
        )
      );
    } catch (err) {
      console.error("Error toggling publish:", err.response?.data || err);
      // alert(err.response?.data?.message || "Failed to toggle publish");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quiz List</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search quizzes..."
          value={filters.search}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />

        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
          <option value="difficulty">Difficulty</option>
          <option value="averageScore">Avg Score</option>
          <option value="totalAttempts">Attempts</option>
        </select>

        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Quiz List */}
      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="border p-4 rounded shadow bg-white">
              {editingQuiz === quiz._id ? (
                <div>
                  <h3 className="font-bold mb-2">✏️ Edit Quiz</h3>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="3"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <select
                    name="difficulty"
                    value={editForm.difficulty}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 border rounded"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateQuiz(quiz._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingQuiz(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                  <p className="text-sm mt-1">
                    Difficulty:{" "}
                    <span className="font-medium">{quiz.difficulty}</span>
                  </p>
                  <p className="text-sm">
                    Course: {quiz.course?.title || "N/A"}
                  </p>
                  <p className="text-sm">
                    Teacher: {quiz.teacher?.firstName} {quiz.teacher?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => {
                      setEditingQuiz(quiz._id);
                      setEditForm({
                        title: quiz.title,
                        description: quiz.description,
                        difficulty: quiz.difficulty,
                      });
                    }}
                    className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleTogglePublish(quiz._id)}
                      className={`px-3 py-1 rounded text-white ${
                        quiz.isPublished ? "bg-yellow-600" : "bg-green-600"
                      }`}
                    >
                      {quiz.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    {quiz.isPublished && quiz.publishedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Published:{" "}
                        {new Date(quiz.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      onClick={() => fetchQuizStats(quiz._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      View Stats
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No quizzes found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          disabled={!pagination.hasPrevPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          disabled={!pagination.hasNextPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Fetch Quiz By ID Section */}
      <div className="mt-10 p-5 border rounded-xl bg-gray-50 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">🔍 Get Quiz By ID</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Quiz ID"
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            id="quizIdInput"
          />
          <button
            type="button"
            onClick={() => {
              const id = document.getElementById("quizIdInput").value;
              if (id) fetchQuizById(id);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Fetch
          </button>
        </div>

        {quizDetails && (
          <div className="mt-5 bg-white p-4 rounded-lg border shadow">
            <h4 className="font-bold text-lg">{quizDetails.title}</h4>
            <p className="text-gray-600">{quizDetails.description}</p>
            <p className="mt-2 text-sm">
              <strong>Course:</strong> {quizDetails.course?.title}
            </p>
            <p className="text-sm">
              <strong>Teacher:</strong> {quizDetails.teacher?.firstName}{" "}
              {quizDetails.teacher?.lastName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
