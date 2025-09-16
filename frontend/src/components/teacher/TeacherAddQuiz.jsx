// src/pages/teacher/TeacherAddQuiz.jsx
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple-choice",
  SHORT_ANSWER: "short-answer",
};

const TeacherAddQuiz = () => {
  const { token, allCourses, fetchAllCourses, fetchQuizzes } = useAppContext();
  
 
  
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    course: "",
    difficulty: "medium",
    questions: [
      {
        question: "",
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
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
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          order: quiz.questions.length + 1,
          options: [{ text: "", isCorrect: false }],
        },
      ],
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://13.233.183.81/api/quizzes", quiz, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    toast.success("Quiz created successfully!");
    
    // Call parent callback to update Quiz List immediately
    if (onQuizCreated) {
      onQuizCreated(res.data.data); // Assuming backend returns created quiz in `data`
    }

    // Reset form
    setQuiz({
      title: "",
      description: "",
      course: "",
      difficulty: "medium",
      questions: [
        {
          question: "",
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          order: 1,
          options: [{ text: "", isCorrect: false }],
        },
      ],
    });

  } catch (err) {
    console.error("Error adding quiz:", err.response?.data || err);
    // alert(err.response?.data?.message || "Failed to create quiz");
  }
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Quiz</h2>
      </div>

      <form className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Quiz Title"
          className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          rows="3"
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        />

        {/* Course Select */}
        <select
          className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
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
          className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          value={quiz.difficulty}
          onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Questions Section */}
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-5 border rounded-2xl shadow-md bg-white space-y-4"
            >
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={QUESTION_TYPES.MULTIPLE_CHOICE}>
                  Multiple Choice (MCQ)
                </option>
                <option value={QUESTION_TYPES.SHORT_ANSWER}>
                  Short Answer
                </option>
              </select>

              {/* Options for multiple-choice */}
              {q.type === QUESTION_TYPES.MULTIPLE_CHOICE &&
                q.options.map((opt, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                    <label className="flex items-center gap-2 text-sm text-gray-600">
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
                className="text-sm text-indigo-600 hover:underline mt-2"
              >
                + Add Option
              </button>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="flex space-x-4">
  <button
    type="button"
    onClick={addQuestion}
    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 hover:bg-gray-200 transition"
  >
    + Add Question
  </button>

  <button
    onClick={handleSubmit}
    className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition"
  >
    Save Quiz
  </button>
</div>

      </form>

      
    </div>
  );
};

export default TeacherAddQuiz;
