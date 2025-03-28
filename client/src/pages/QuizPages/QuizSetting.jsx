import React, { useState } from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom';
import quizStore from '../../store/quizStore';
import { useAuth } from '../../utils/authUtils';
const QuizSetting = () => {
  const { userData } = useAuth();
  const [isScheduled, setIsScheduled] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  const quizData = quizStore((state) => state.quizData)
  const navigate = useNavigate()

  const formatDateTime = (date, time) =>{
    if (!date || !time) {
      return null
    }
    const dateTime = `${date} ${time}`
    const dateObj = new Date(dateTime)
    return isNaN(dateObj.getTime())? null : dateObj.toISOString()
  }

  const publishQuiz = async() =>{
    const updatedQuiz = {
      quizId: quizData._id,
      updatedQuizData: {
        status: "active",
        attempts: attempts,
        startingAt: formatDateTime(startDate, startTime),
        endingAt: formatDateTime(endDate, endTime)
    }
    }
      const token = await userData.user.getIdToken();
      const response = await fetch(`${BASE_URL}/quiz/update-quiz`,{
        method: 'POST',
        headers:{
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedQuiz)
      })
      if (!response.ok) {
        throw new Error('Failed to update');
      }
      
      const result = await response.json()
      if (result.success) {
        navigate('/')
      }
  }

  return (
    <div className="w-full max-h-[100vh] flex flex-col items-end">
      <div className="w-full md:w-[77%]">
        <div className="p-6 flex flex-col gap-6">
            <Header/>
            {/* Quiz Details */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-2xl font-semibold text-left">{quizData?.generatedQuiz?.quiz_details?.topic}<span className="text-gray-500 text-sm m-5"></span></h3>
          <ul className="text-gray-600 mt-2 text-left">
            <li>• {quizData?.generatedQuiz?.quiz_details?.number_of_questions} questions</li>
            <li>• {quizData?.generatedQuiz?.quiz_details?.difficulty} difficulty</li>
            <li>• 20 minutes</li>
            <li>• 150 total points</li>
          </ul>
        </div>

        {/* Availability */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-2xl font-semibold text-center md:text-left">Availability</h3>
          <div className="mt-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="availability" checked={!isScheduled} onChange={() => setIsScheduled(false)} />
              <span className='text-left'>Make quiz available immediately</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="availability" checked={isScheduled} onChange={() => setIsScheduled(true)} />
              <span className='text-left'>Schedule availability</span>
            </label>

            {isScheduled && (
              <div className="mt-4 grid grid-rows-2 justify-center md:justify-start gap-4">
                <div className='flex flex-col md:flex-row gap-3 items-center'>
                  <label className="text-gray-600 font-semibold text-sm">Start:</label>
                  <input className="block w-48 border-gray-300 border-2 rounded-xl shadow-xl p-2 mt-1" placeholder='Select date' onFocus={(e)=> e.target.type = 'date'} onBlur={(e) => e.target.value === '' ? (e.target.type = 'text') : null} value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                  <input className="block w-48 border-gray-300 border-2 rounded-xl shadow-xl p-2 mt-1" placeholder='Select time' onFocus={(e)=> e.target.type = 'time'} onBlur={(e) => e.target.value === '' ? (e.target.type = 'text') : null} value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                </div>
                <div className='flex flex-col md:flex-row gap-3 items-center'>
                  <label className="text-gray-600 font-semibold text-sm">End:</label>
                  <input className="block w-48 border-gray-300 border-2 rounded-xl shadow-xl p-2 mt-1" placeholder='Select date' onFocus={(e)=> e.target.type = 'date'} onBlur={(e) => e.target.value === '' ? (e.target.type = 'text') : null} value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                  <input className="block w-48 border-gray-300 border-2 rounded-xl shadow-xl p-2 mt-1" placeholder='Select time' onFocus={(e)=> e.target.type = 'time'} onBlur={(e) => e.target.value === '' ? (e.target.type = 'text') : null} value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Access */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl text-center md:text-left font-semibold">Student Access</h3>
          <div className="mt-4 flex flex-col md:flex-row gap-3 items-center">
            <label className="text-gray-800 text-sm font-semibold">Allowed Attempts</label>
            <input 
              type="number" 
              min="1" 
              value={attempts} 
              onChange={(e) => setAttempts(e.target.value)} 
              className="block w-48 border-gray-300 border-2 rounded-xl shadow-xl p-2 mt-1"
            />
            <p className='text-gray-500'>Set the amount of times a student is allow to take the quiz</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="px-3 md:px-7 py-2 font-semibold bg-gray-50 text-gray-700 text-xs lg:text-lg rounded-lg" onClick={()=> navigate('/')}>Save as Draft</button>
          <button className="px-3 md:px-7 py-2 font-semibold bg-gray-50 text-gray-700 text-xs lg:text-lg rounded-lg" onClick={()=> navigate('/review-quiz')}>Back to Questions</button>
          <button className="px-3 md:px-7 py-2 font-semibold bg-black text-white text-xs lg:text-lg rounded-lg" onClick={publishQuiz}>Publish Quiz</button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default QuizSetting
