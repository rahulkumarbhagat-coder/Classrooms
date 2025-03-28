import React from 'react'
import quizStore from '../../store/quizStore'

const AllResult = () => {
  const quizData = quizStore((state) => state.quizData)
    
  return (
    <div className='w-full max-h-[100vh] flex flex-col items-end'>
      <div className="w-full md:w-[77%]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-20 p-6 mx-3">
            {quizData?.results?.map((resultData, index)=> (
              <div key={index} className="flex items-center justify-center bg-opacity-20">
              <div className="bg-white text-black p-3 rounded-3xl shadow-lg w-80 relative flex flex-col items-center ">
                <div className="text-6xl"><img src="military-medal.svg" alt="medal" /></div>
                <h3 className="text-lg font-bold mt-4">Great Job!</h3>
                <p className="text-gray-600 font-bold mt-1">Your score</p>
                <p className="text-3xl font-bold">{resultData.result.score}</p>
                <div className="flex  justify-center gap-2 mt-6 w-full px-4">
                  <div className="bg-yellow-400 px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{quizData?.generatedQuiz?.quiz_details?.number_of_questions} Questions</div>
                  <div className="bg-green-500 px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{resultData.result.correct} Correct</div>
                  <div className="bg-red-500 px-3 py-2 shadow-2xl rounded-lg text-white font-medium">{resultData.result.inCorrect} Incorrect</div>
                </div>
              </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default AllResult
