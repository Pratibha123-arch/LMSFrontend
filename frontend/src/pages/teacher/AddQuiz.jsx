import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const AddQuiz = () => {
  const { token, allCourses, fetchAllCourses, fetchQuizzes } = useAppContext();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    course: "",
    difficulty: "medium",
    questions: [
      {
        question: "",
        type: "multiple-choice",
        order: 1,
        options: [{ text: "", isCorrect: false }],
      },
    ],
  });

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value, isCorrect) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = { text: value, isCorrect };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          type: "multiple-choice",
          order: quiz.questions.length + 1,
          options: [{ text: "", isCorrect: false }],
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/quizzes", quiz, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Quiz created successfully!");
      console.log(res.data);
      fetchQuizzes();
    } catch (err) {
      console.error("Error adding quiz:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create quiz");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Create Quiz</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Quiz Title"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />

          {/* Course Select */}
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={quiz.course}
            onChange={(e) => setQuiz({ ...quiz, course: e.target.value })}
            required
          >
            <option value="">Select Course</option>
            {allCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={quiz.difficulty}
            onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Questions */}
          {quiz.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                required
              />

              <select
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "type", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
              </select>

              {/* Options */}
              {q.type === "multiple-choice" &&
                q.options.map((opt, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex gap-3 mb-2 items-center bg-white p-2 rounded-lg border border-gray-200"
                  >
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          e.target.value,
                          opt.isCorrect
                        )
                      }
                    />
                    <label className="flex items-center gap-1 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={opt.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            opt.text,
                            e.target.checked
                          )
                        }
                      />
                      Correct
                    </label>
                  </div>
                ))}

              <button
                type="button"
                onClick={() => {
                  const updatedQuestions = [...quiz.questions];
                  updatedQuestions[qIndex].options.push({
                    text: "",
                    isCorrect: false,
                  });
                  setQuiz({ ...quiz, questions: updatedQuestions });
                }}
                className="text-sm text-indigo-600 hover:underline mt-1"
              >
                + Add Option
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            + Add Question
          </button>

          <button
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition block ml-auto"
          >
            Save Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
