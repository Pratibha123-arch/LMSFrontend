import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import QuizStart from "./QuizStart";

const QuizzesList = () => {
  const { quizzes, fetchQuizzes } = useAppContext();
  const [selectedQuiz, setSelectedQuiz] = React.useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (!quizzes || quizzes.length === 0) return <p>No quizzes available.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>

      {selectedQuiz ? (
        <QuizStart quiz={selectedQuiz} goBack={() => setSelectedQuiz(null)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p>Course: {quiz.course?.title}</p>
              <p>Teacher: {quiz.teacher?.firstName} {quiz.teacher?.lastName}</p>
              <p>Total Questions: {quiz.questions?.length}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setSelectedQuiz(quiz)}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesList;
