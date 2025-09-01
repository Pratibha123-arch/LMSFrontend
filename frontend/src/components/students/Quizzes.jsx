import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizzesList = ({ token }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data.data.quizzes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div>
      <h2>Available Quizzes</h2>
      {selectedQuiz ? (
        <QuizStart
          quiz={selectedQuiz}
          token={token}
          goBack={() => setSelectedQuiz(null)}
        />
      ) : (
        <div>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>Course: {quiz.course.title}</p>
              <p>
                Teacher: {quiz.teacher.firstName} {quiz.teacher.lastName}
              </p>
              <p>Total Questions: {quiz.questions.length}</p>
              <button onClick={() => setSelectedQuiz(quiz)}>Start Quiz</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesList;
