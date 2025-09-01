// pages/teacher/AddQuiz.jsx
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
    fetchAllCourses(); // Load courses for dropdown
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
      const res = await axios.post(
        "http://localhost:5000/api/quizzes",
        quiz,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Quiz created successfully!");
      console.log(res.data);
      fetchQuizzes(); // refresh quiz list
    } catch (err) {
      console.error("Error adding quiz:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create quiz");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          className="border p-2 w-full"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        />

        <select
          className="border p-2 w-full"
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

        <select
          className="border p-2 w-full"
          value={quiz.difficulty}
          onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Questions */}
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-2 mb-2">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              className="border p-2 w-full mb-2"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(qIndex, "question", e.target.value)
              }
              required
            />

            <select
              value={q.type}
              onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
              className="border p-2 w-full mb-2"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
            </select>

            {/* Options for multiple-choice */}
            {q.type === "multiple-choice" &&
              q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex gap-2 mb-1 items-center">
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    className="border p-1 flex-1"
                    value={opt.text}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value, opt.isCorrect)
                    }
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, opt.text, e.target.checked)
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
                updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
                setQuiz({ ...quiz, questions: updatedQuestions });
              }}
              className="text-sm text-indigo-600 mt-1"
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Add Question
        </button>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded block mt-4">
          Save Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuiz;
