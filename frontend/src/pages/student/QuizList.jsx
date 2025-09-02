import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const QuizList = () => {
  const { token } = useContext(AppContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/quizzes", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setQuizzes(res.data.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [token]);

  if (loading) return <p className="text-center text-gray-600">Loading quizzes...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-3">{quiz.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Difficulty:{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  quiz.difficulty === "easy"
                    ? "bg-green-500"
                    : quiz.difficulty === "medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {quiz.difficulty}
              </span>
            </p>

            {token && (
              <Link
                to={`/quiz/${quiz._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Quiz
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
