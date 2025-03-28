import React, { useState } from "react";
import quizStore from "../../store/quizStore";
import Header from '../../components/Header'
import { Link } from "react-router-dom";

const QuizResults = () => {
  const quizData = quizStore((state) => state.quizData)
  const result = quizStore((state) => state.quizResults);
  const [showResult, setShowResult] = useState(true)

  return (
    <div className='w-full max-h-[100vh] flex flex-col items-end'>
      <div className="w-full md:w-[77%]">
        <div className="p-2 md:p-6 flex flex-col gap-6 bg-gray-300 text-gray-900">

      {/* Main Content */}
      {result ? <div>
      {/* Profile and Breadcrumbs */}
      <Header/>

        <div className="flex text-gray-500 my-3">
          <div><Link to={'/display-my-quiz'}><p>Quiz history</p></Link></div>
          <div><Link to={'/display-all-result'}><p> / Quiz results</p></Link></div>
          </div>
          

      <main className="p-4 md:p-8 bg-white shadow-md rounded-3xl">
        <div className="rounded-4xl">
          <h3 className="text-lg text-left font-bold mb-4 text-gray-700">Answers Reviews</h3>
          <div className="space-y-4 mt-4">
            {result?.quizResults?.map((res, index) => (
              <div key={index} className="bg-green-100 p-3 md:p-6 rounded-xl border border-[#51CA58] shadow-md flex flex-col">
                <div className="flex gap-3 md:w-[80%] justify-start self-center mb-4">
                  {res.isCorrect?<img src="Group 26.svg" alt="" />:<p className="text-lg">❌</p>}
                  <p className="font-medium text-left">{res.question}</p>
                </div>
                <div className="flex flex-col items-start gap-5 ml-10">
                <p className="text-sm text-gray-700">Your answer: <span className="font-semibold">{res.userAnswer}</span></p>
                {!res.isCorrect && <p className="text-sm text-gray-700">Correct answer: <span className="font-semibold">
                  {quizData?.generatedQuiz?.quiz_questions.find((question)=>question.question_text === res.question)?.answer ||
                  quizData?.generatedQuiz?.quiz_questions.find((question)=>question.question_text === res.question)?.sample_answer
                  }</span></p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>: <p>Loading...</p>}
      
      
      {/* Results Popup */}
      
      {showResult && <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
        <div className="bg-white text-black p-4 rounded-3xl shadow-lg w-[95%] md:w-[40%] lg:w-[30%] relative flex flex-col items-center">
          <button onClick={()=> setShowResult(false)} className="absolute top-2 right-2 shadow-gray-700 shadow-2xl p-2 rounded-full font-bold">✕</button>
          <div className="text-6xl"><img src="military-medal.svg" alt="medal" /></div>
          <h3 className="text-lg font-bold mt-4">Great Job!</h3>
          <p className="text-gray-600 font-bold mt-1">Your score</p>
          <p className="text-3xl font-bold">{result.score}</p>
          <div className="flex justify-center gap-2 mt-6 w-full px-4">
            <div className="bg-yellow-400 px-2 lg:px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{quizData?.generatedQuiz?.quiz_details?.number_of_questions} Questions</div>
            <div className="bg-green-500 px-2 lg:px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{result.correct} Correct</div>
            <div className="bg-red-500 px-2 lg:px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{result.inCorrect} Incorrect</div>
          </div>
        </div>
      </div>}
    </div>
    </div>
    </div>
  );
};

export default QuizResults;
