import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

const QuizPage = () => {
  const { token } = useContext(AppContext);
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [maxReached, setMaxReached] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch quiz + attempts
  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      try {
        const res = await axios.get(`http://13.233.183.81/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setQuiz(res.data.data);
        setQuestions(res.data.data.questions || []);
        setAnswers(
          res.data.data.questions.map((q) => ({
            questionId: q._id,
            selectedOption: null,
            textAnswer: "",
          }))
        );

        const attRes = await axios.get(`http://13.233.183.81/api/quizzes/${quizId}/attempts`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setAttempts(attRes.data.data || []);

        if (res.data.data.maxAttempts && attRes.data.data.length >= res.data.data.maxAttempts) {
          setMaxReached(true);
        }
      } catch (error) {
        console.error("Failed to fetch quiz or attempts", error);
        // alert(error.response?.data?.message || error.message);
        navigate("/quiz-list");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndAttempts();
  }, [quizId, token, navigate]);

  const handleOptionChange = (qIndex, optionIndex) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[qIndex].selectedOption = optionIndex;
      return newAnswers;
    });
  };

  const handleTextChange = (qIndex, text) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[qIndex].textAnswer = text;
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!quizId) 
      //return alert("Quiz ID missing");
    setSubmitting(true);

    try {
      const res = await axios.post(
        `http://13.233.183.81/api/quizzes/${quizId}/submit`,
        { answers, timeSpent },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setResult(res.data.data);
    } catch (error) {
      console.error("Submit failed", error);
      // alert(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading quiz...</div>;

  if (maxReached) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Maximum Attempts Reached</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              You have already taken this quiz the maximum allowed number of times.
            </p>
            <Button className="mt-4" onClick={() => navigate("/quiz-list")}>
              Back to Quiz List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Quiz Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Score: {result.attempt.score}%</p>
            <p className="text-gray-700">
              Points Earned: {result.attempt.pointsEarned}/{result.attempt.totalPoints}
            </p>
            <p
              className={`mt-2 font-bold ${
                result.attempt.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.attempt.passed ? "You passed!" : "Try again!"}
            </p>

            {result.showCorrectAnswers && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Correct Answers:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {result.correctAnswers.map((ca) => (
                    <li key={ca.questionId}>
                      <span className="font-medium">Question:</span> {ca.questionId} <br />
                      <span className="font-medium">Correct Answer:</span> {ca.correctAnswer} <br />
                      <span className="font-medium">Explanation:</span>{" "}
                      {ca.explanation || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button className="mt-6" onClick={() => navigate("/quiz-list")}>
              Back to Quiz List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">{quiz.title}</h2>
      <p className="mb-6 text-gray-600">{quiz.description}</p>

      <div className="mb-6 text-sm text-gray-500 font-medium">
        Time Spent: <span className="text-blue-600">{timeSpent}s</span>
      </div>

      {questions.map((q, i) => (
        <Card key={q._id} className="mb-5 shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <p className="font-medium text-gray-800 mb-3">
              {i + 1}. {q.question}
            </p>
            {q.type === "multiple-choice" || q.type === "true-false" ? (
              q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 mb-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    checked={answers[i]?.selectedOption === idx}
                    onChange={() => handleOptionChange(i, idx)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700">{opt.text}</span>
                </label>
              ))
            ) : (
              <input
                type="text"
                value={answers[i]?.textAnswer || ""}
                onChange={(e) => handleTextChange(i, e.target.value)}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Type your answer..."
              />
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-4 w-full sm:w-auto"
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  );
};

export default QuizPage;
