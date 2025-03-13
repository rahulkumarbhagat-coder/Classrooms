import React from 'react'

const QuizLoader = ({load}) => {
  return (
    <div>
      <div className="w-3/4 h-3/4 shadow-2xl bg-white rounded-2xl flex flex-col items-center justify-center absolute right-5 bottom-10">
            <h1 className='text-3xl font-medium mb-5'>Generating your Quiz...</h1>
            <div className="rounded-3xl border-gray-100 bg-[#D9D9D9] w-[60%] h-2 mb-10">
              <div className={`rounded-3xl border-gray-100 bg-black h-2`} style={{width:`${load}%`}}></div>
            </div>
            <p>Creating answer options...</p>
            <p>Finalizing quiz format...</p>
            <img className='w-60 h-60'  src="floating-orange-robot-7dN1HkTkG1.svg" alt="robot" />
            <button className='w-80 h-11 border-2 border-gray-200 font-sans shadow-2xl'>Clear Generation</button>
        </div>
    </div>
  )
}

export default QuizLoader
