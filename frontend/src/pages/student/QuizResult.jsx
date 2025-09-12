import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const QuizResult = () => {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await axios.get(
          `http://13.233.183.81/api/quizzes/${id}/attempts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttempt(res.data.data[res.data.data.length - 1]); // Last attempt
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttempt();
  }, [id, token]);

  if (!attempt) return <p>Loading results...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Quiz Result</h1>
      <p>Score: {attempt.score}</p>
      <p>Points Earned: {attempt.pointsEarned}/{attempt.totalPoints}</p>
      <p>Passed: {attempt.passed ? 'Yes' : 'No'}</p>
      <p>Time Spent: {attempt.timeSpent} seconds</p>
      <h2 className="text-xl mt-4">Answers:</h2>
      {attempt.answers.map((a, idx) => (
        <div key={idx} className="border p-2 my-2 rounded">
          <p>Question ID: {a.questionId}</p>
          <p>Answer: {a.textAnswer || a.selectedOption}</p>
          <p>Correct: {a.isCorrect ? 'Yes' : 'No'}</p>
          <p>Points Earned: {a.pointsEarned}</p>
        </div>
      ))}
    </div>
  );
};

export default QuizResult;
