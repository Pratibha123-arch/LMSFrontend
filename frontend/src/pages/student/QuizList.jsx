import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const QuizList = () => {
  const { token } = useContext(AppContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quizzes', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
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

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="p-4 border rounded shadow">
          <h2 className="text-lg font-bold">{quiz.title}</h2>
          <p>{quiz.description}</p>
          <p>Difficulty: {quiz.difficulty}</p>
          {token && <Link to={`/quiz/${quiz._id}`} className="text-blue-600">Start Quiz</Link>}
        </div>
      ))}
    </div>
  );
};

export default QuizList;
