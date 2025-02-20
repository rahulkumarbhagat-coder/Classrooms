import React from "react";
import quizStore from "../store/quizStore";

const Result = () => {
  const result = quizStore((state) => state.quizResults);
  return (
    <div>
      {result.quizResults.map((result, index) => (
        <div className="" key={index}>
          <p>{result.question}</p>
          <p>Your Answer: {result.userAnswer}</p>
          <p>{result.isCorrect ? "✅ Correct" : "❌ Incorrect"}</p>
        </div>
      ))}
      <p>Your Score: {result.score}</p>
    </div>
  );
};

export default Result;
