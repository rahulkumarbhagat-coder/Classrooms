import React from "react";
import quizStore from "../store/quizStore";

const QuizResults = () => {
  const {quizData} = quizStore()
  const result = quizStore((state) => state.quizResults);

  return (
    <div className="flex min-h-screen bg-gray-300 text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-100 p-6 flex flex-col space-y-6 min-h-screen shadow-md">
        <div className="flex gap-3 mb-[50px] justify-center">
        <img src="Frame (2).svg" alt="logo" className="w-10 h-10"/>
        <h1 className="text-3xl font-bold text-gray-900">QuizCraft</h1>
        </div>
        <nav className="space-y-4">
          <a href="#" className="block mb-8 text-gray-700 font-medium hover:text-black">
          <div className="flex gap-8 justify-center">
          <img src="ic_round-space-dashboard.svg" alt="" /> Dashboard
          </div>
            </a>
            <a href="#" className="block mb-8 text-gray-700 font-medium hover:text-black">
          <div className="flex gap-8 justify-center">
          <img src="graph-bar 1.svg" alt="" /> Achievement
          </div>
            </a>
          <a href="#" className="block mb-8 text-white bg-black p-3 rounded-lg">
            <div className="flex gap-8 justify-center">
            <img src="graph-bar 1 (1).svg" alt="" /> Quiz History
            </div>
            </a>
        </nav>
        <div className="mt-auto p-4 rounded-lg text-center text-white">
          <img src="Group 83.png" alt="" />
        </div>
        <button className="mt-6 text-red-600 font-medium">
          <div className="flex gap-5 justify-center">
          <img src="Frame (1).svg" alt="" />
          Log out
          </div>
          </button>
      </aside>
      
      {/* Main Content */}
      {result?.quizResults.length > 0 ? <div className="flex flex-col w-3/4 p-6 pr-0">
      {/* Profile and Breadcrumbs */}
      <div className="flex gap-5 justify-between self-end items-center">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-2xl">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center"><img src="Frame (3).svg" alt="" /></div>
            <div className="ml-3 text-left">
              <p className="font-bold">Lisa Jones</p>
              <p className="text-sm text-gray-500">Student</p>
            </div>
            <img src="weui_arrow-filled.svg" alt="" className="self-end"/>
          </div>
          <div className="rounded-full shadow-2xl w-10 h-10 bg-white self-start flex justify-center items-center"><img src="Frame (4).svg" alt="" /></div>
        </div>

        <p className="text-gray-500 self-start ml-6">Quiz history / Quiz results</p>

      <main className="flex-1 p-8 overflow-auto bg-white shadow-md rounded-3xl m-6 mr-0">
        <div className="rounded-4xl">
          <h3 className="text-lg text-left font-bold mb-4 text-gray-700">Answers Reviews</h3>
          <div className="space-y-4 mt-4">
            {result?.quizResults?.map((res, index) => (
              <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col">
                <div className="flex gap-3 w-[60%] justify-start self-center mb-4">
                  {res.isCorrect?<img src="Group 26.svg" alt="" />:<p className="text-lg">❌</p>}
                  <p className="font-medium text-left">{res.question}</p>
                </div>
                <div className="flex flex-col items-start gap-5 ml-10">
                <p className="text-sm text-gray-700">Your answer: <span className="font-semibold">{res.userAnswer}</span></p>
                {!res.isCorrect && <p className="text-sm text-gray-700">Correct answer: <span className="font-semibold">{quizData.quiz_questions.map((question)=>{
                  if (question.question_text === res.question) return question.answer || question.sample_answer
                })}</span></p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>: <p>Loading...</p>}
      
      
      {/* Results Popup */}
      {/* <div className="fixed inset-0 flex items-center justify-center bg-opacity-20">
        <div className="bg-white text-black p-4 rounded-3xl shadow-lg w-90 relative flex flex-col items-center">
          <button className="absolute top-2 right-2 shadow-gray-700 shadow-2xl p-2 rounded-full font-bold">✕</button>
          <div className="text-6xl"><img src="military-medal.svg" alt="medal" /></div>
          <h3 className="text-lg font-bold mt-4">Great Job!</h3>
          <p className="text-gray-600 font-bold mt-1">Your score</p>
          <p className="text-3xl font-bold">{result.score}</p>
          <div className="flex justify-between gap-2 mt-6 w-full px-4">
            <div className="bg-yellow-400 px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{quizData.quiz_details.number_of_questions} Questions</div>
            <div className="bg-green-500 px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{result.score} Correct</div>
            <div className="bg-red-500 px-3 py-2 shadow-2xl rounded-lg text-white font-medium">0 Incorrect</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default QuizResults;
