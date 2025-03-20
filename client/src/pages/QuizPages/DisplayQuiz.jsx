import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import quizStore from '../../store/quizStore';
import { useNavigate } from 'react-router-dom';

const DisplayQuiz = () => {
  
    const quizData = quizStore((state) => state.quizData)
    const {newResults} = quizStore()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(120);
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    
    useEffect(()=>{
      console.log(quizData);
    },[quizData])


    //quiz details
      const { quiz_details, quiz_questions } = quizData;
      const currentQuestion = quiz_questions[currentQuestionIndex];
    

    //timer
    useEffect(()=>{
      if (timeLeft < 0) {
         answerCheck()
        return;
      }
  
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
  
      return ()=> clearTimeout(timer)
    }, [timeLeft])
    
    const quizTimer = () => {
      if (timeLeft < 0) {return "0 : 00"}
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      return `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
    };
  
    //for T/F & mcq submission
    const handleAnswerSelect = (question_number, selectedOption) =>{
      setUserAnswers((prev) =>({
        ...prev,
        [question_number]: selectedOption
      }))
    }

    //for written answers
    const handleWrittenAnswer = (question_number, text) =>{
      setUserAnswers(prev => ({
        ...prev,
        [question_number]: text
      }))
    }
    
    //previous/next/submit buttons
    const handleNext = () => {
      if (currentQuestionIndex < quiz_questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

    const handlePrevious = () => {
      if (currentQuestionIndex !== 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };


    //answer checking
    const answerCheck = async() =>{
      navigate('/display-result')
      let score = 0;
      let result = await Promise.all(quiz_questions.map(async(question)=>{
        let isCorrect = false
        const userAnswer = userAnswers[question.question_number]
        if (question.question_type === 'True/False' || question.question_type === 'MCQ') {
          isCorrect = question.answer === userAnswer
        }

        else if (question.question_type === 'Written') {
          const response = await fetch(`${BASE_URL}/quiz/check`, {
            method: 'POST',
            headers:{
              'Content-type': "application/json",
            },
            body: JSON.stringify({
              userAnswer:{
                question: question.question_text,
                answer: userAnswer
              },
              totalMarks: 5
            })
          })
          const result = await response.json()
          isCorrect = result.isCorrect
          console.log(result);
        }

        if (isCorrect) score++

        return {question: question.question_text, userAnswer, isCorrect}
      }))
      console.log("Quiz results", result);
      console.log(`Score : ${score}/${quiz_questions.length}`);
      newResults({
        quizResults: result,
        score: `${score}/${quiz_questions.length}`,
        correct: score,
        inCorrect: quiz_questions.length - score
      })
    }
  
    return (
      <>
        <div className="w-full min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden z-999">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-900 to-black opacity-40"></div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-500 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-green-600 opacity-30 rounded-full blur-3xl"></div>
      
      <h1 className="text-2xl font-bold text-center text-white">Time Left : {quizTimer()}</h1>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl border border-green-500 rounded-xl p-8 mb-6 shadow-[0_0_20px_rgba(0,255,0,0.6)] bg-gray-900 relative z-10"
      >
        <h2 className="text-4xl font-bold text-green-300 border-b border-green-400 pb-3 uppercase tracking-wide">{quiz_details.topic} Quiz</h2>
        <p className="mt-3 text-lg text-green-300">Difficulty: {quiz_details.difficulty} | Type: {quiz_details.type} | Questions: {quiz_details.number_of_questions}</p>
      </motion.div>
      
      <motion.div 
        key={currentQuestion.question_number}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl border border-green-500 rounded-xl p-6 shadow-lg bg-gray-900 relative z-10 transition-transform hover:scale-105"
      >
        <h3 className="text-xl font-semibold text-green-300 border-b border-green-400 pb-2">Question {currentQuestion.question_number}</h3>
        <p className="mb-4 pt-2 text-green-200 text-lg">{currentQuestion.question_text}</p>
        {currentQuestion.question_type === "Written" && (
          <textarea onChange={(e)=> handleWrittenAnswer(currentQuestion.question_number, e.target.value)} value={userAnswers[currentQuestion.question_number] || ''} className="w-full p-4 border border-green-500 rounded-xl bg-gray-800 text-green-200 outline-none focus:ring-2 focus:ring-green-400 shadow-inner resize-none" placeholder="Write your answer here..." rows="4" />
        )}
        {currentQuestion.question_type === "True/False" && (
          <div className="flex gap-6 mt-4">
            <label className="flex items-center text-lg cursor-pointer transform transition hover:scale-105 bg-gray-800 p-3 rounded-lg shadow-inner">
              <input onClick={()=> handleAnswerSelect(currentQuestion.question_number, 'True')} type="radio" name={`q${currentQuestion.question_number}`} value="true" className="mr-2 accent-green-400" /> True
            </label>
            <label className="flex items-center text-lg cursor-pointer transform transition hover:scale-105 bg-gray-800 p-3 rounded-lg shadow-inner">
              <input onClick={()=> handleAnswerSelect(currentQuestion.question_number, 'False')} type="radio" name={`q${currentQuestion.question_number}`} value="false" className="mr-2 accent-green-400" /> False
            </label>
          </div>
        )}
        {currentQuestion.question_type === "MCQ" && currentQuestion.options && (
          <div className="flex flex-col gap-3 mt-4">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center text-lg text-left cursor-pointer transform transition hover:scale-105 bg-gray-800 p-3 rounded-lg shadow-inner">
                <input onClick={()=> handleAnswerSelect(currentQuestion.question_number, option)} type="radio" name={`q${currentQuestion.question_number}`} value={option} className="mr-2 accent-green-400" /> {option}
              </label>
            ))}
          </div>
        )}
      </motion.div>
      
      <div className="flex gap-5">
        <motion.button 
        onClick={handlePrevious}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={currentQuestionIndex === 0}
        className={`w-full max-w-4xl text-gray-900 font-bold p-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(0,255,0,0.5)] relative z-10 ${currentQuestionIndex === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
      >
        "Previous Question"
      </motion.button>

        <motion.button 
        onClick={()=>{
          if (currentQuestionIndex === quiz_questions.length - 1) {
            answerCheck()
          }
          else{
            handleNext()
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='w-full max-w-4xl text-gray-900 font-bold p-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(0,255,0,0.5)] relative z-10 bg-green-500 hover:bg-green-600'
      >
        {currentQuestionIndex === quiz_questions.length - 1 ? "Quiz Submit" : "Next Question"}
      </motion.button>
      </div>
      
    </div>
    </>
    );
}

export default DisplayQuiz
