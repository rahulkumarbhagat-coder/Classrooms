import React from 'react'

const QuizLoader = ({load, cancelQuizGeneration}) => {
  return (
    <div className="w-full max-h-[100vh] flex flex-col items-center p-3 md:p-6">
      <div className="w-full">
      <div className="h-3/4 p-2 shadow-2xl bg-white rounded-2xl flex flex-col items-center justify-between bottom-10">
            <h1 className='text-xl md:text-3xl font-medium my-5'>Generating your Quiz...</h1>
            <div className="rounded-3xl border-gray-100 bg-[#D9D9D9] w-[80%] h-2 mb-10">
              <div className={`rounded-3xl border-gray-100 bg-black h-2`} style={{width:`${load}%`}}></div>
            </div>
            <p className='text-sm md:text-lg'>Creating answer options...</p>
            <p className='text-sm md:text-lg'>Finalizing quiz format...</p>
            <img className='w-60 h-60 animate-[upDown_1.5s_ease-in-out_infinite]'  src="floating-orange-robot-7dN1HkTkG1.svg" alt="robot" />
            <button onClick={cancelQuizGeneration} className='w-40 md:w-80 h-11 mb-5 border-2 border-gray-200 font-sans shadow-2xl'>Clear Generation</button>
        </div>
        </div>
    </div>
  )
}

export default QuizLoader
