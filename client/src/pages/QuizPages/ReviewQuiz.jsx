import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import quizStore from '../../store/quizStore'
import EditQuestionModal from '../../components/EditQuestionModal'
import { useAuth } from '../../utils/authUtils'

const ReviewQuiz = () => {
    const { userData } = useAuth();
    const quizData = quizStore((state) => state.quizData)
    const newQuiz = quizStore((state) => state.newQuiz)
    const setAllQuiz = quizStore((state => state.setAllQuiz))
    const [mcqQuestion, setMcqQuestion] = useState([])
    const [tfQuestion, setTfQuestion] = useState([])
    const [writtenQuestion, setWrittenQuestion] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

    const handleEditClick = (question) => {
      setSelectedQuestion(question);
      setIsOpen(true);
    };

    const onClose = () =>{
      setIsOpen(false)
    }

    const handleSaveChanges = async(updatedQuestion) => {
      const updatedQuestions = quizData?.generatedQuiz?.quiz_questions?.map((question) =>{
        return question.question_number === updatedQuestion.question_number ? updatedQuestion : question
      })

      const updatedQuiz = {
        quizId: quizData._id,
        updatedQuizData: {
          "generatedQuiz.quiz_questions": updatedQuestions
        }
      }
      const token = await userData.user.getIdToken();
      const response = await fetch(`${BASE_URL}/quiz/update-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedQuiz)
      })
      const result = await response.json()
      setIsOpen(false);
      getAllQuiz()
      newQuiz(result.updatedQuiz)
    };

    const getAllQuiz = async() =>{
          try {
            const response = await fetch(`${BASE_URL}/quiz/get-all-quiz`);
            if (!response.ok) throw new Error("Failed to fetch quizzes");
            const quizzes = await response.json();
            setAllQuiz(quizzes)
          } catch (error) {
            console.error("Error fetching quizzes:", error.message);
          }
        }
      
        useEffect(()=>{
          getAllQuiz()
        }, [])

  useEffect(()=>{
    if (!quizData?.generatedQuiz?.quiz_questions) return;

    const mcq = []
    const tf = []
    const written = []
    
    quizData?.generatedQuiz?.quiz_questions?.forEach(question => {
      if (question.question_type === 'MCQ' || question.question_type === 'Multiple Choice'){
        mcq.push(question)
      } else if (question.question_type === 'True/False') {
        tf.push(question);
      } else if (question.question_type === 'Written' || question.question_type === 'Essay' || question.question_type === 'Short Answer') {
        written.push(question);
      }
    })

    setMcqQuestion(mcq)
    setTfQuestion(tf)
    setWrittenQuestion(written)    
  },[quizData])

  return (
    <div className='w-full max-h-[100vh] flex flex-col items-end'>
      <div className="w-full md:w-[77%]">
        <div className="p-6 flex flex-col gap-6">
        {isOpen && <EditQuestionModal onSave={handleSaveChanges} isOpen={isOpen} question={selectedQuestion} onClose={onClose}/>}
        <Header/>
      {/* Quiz Details */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-2xl font-semibold text-left">{quizData?.title || "Untitled Quiz"}<span className="text-gray-500 text-sm m-5"></span></h3>
          <ul className="text-gray-600 mt-2 text-left">
            <li>• {quizData?.generatedQuiz?.quiz_details?.number_of_questions} questions</li>
            <li>• {quizData?.generatedQuiz?.quiz_details?.difficulty} difficulty</li>
            <li>• 20 minutes</li>
            <li>• 150 total points</li>
          </ul>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-2xl shadow-md mb-2">
      <h3 className="text-2xl font-semibold text-left">Review Questions</h3>
      <div className="mt-4 p-3 space-y-4 border-t-2 border-[#CFCFCF] text-left">
      {[
      { title: "MCQ Questions", data: mcqQuestion },
      { title: "True/False Questions", data: tfQuestion },
      { title: "Written Questions", data: writtenQuestion }
    ].map((section, sectionIndex) => (
      section.data.length > 0 && (
        <div key={sectionIndex}>
          <h4 className="text-lg font-bold text-gray-800 mt-4">{section.title}</h4>
          {section.data.map((question, index) => (
            <div key={`${sectionIndex}-${index}`} className="border border-gray-300 rounded-lg p-2 md:p-4">
              <div className="flex justify-between items-start">
                <p className="text-gray-800 font-semibold text-sm md:text-lg w-[95%]">{index + 1}. {question.question_text}</p>
                <button className="hover:underline cursor-pointer" onClick={()=> handleEditClick(question)}><img src="Vector.svg" alt="" /></button>
              </div>
              {question.options?.length > 0 && (
                <>
                <ul className="flex flex-col gap-3 md:gap-0 list-disc list-inside mt-2 text-gray-700 text-sm md:text-lg">
                  {question.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
                <p className='text-gray-800 text-xs md:text-sm font-semibold pt-2'>Answer: {question.answer}</p>
                </>
              )}
              {question.question_type === 'True/False' && question?.answer?.length > 0 && (
                <>
                <p className='mt-2 text-gray-700'>Answers: {question.answer}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )
    ))}
      </div>
    </div>
    <div className="flex justify-center space-x-4">
          <button className="w-[33%] md:w-[25%] px-3 md:px-7 py-2 font-semibold bg-white text-gray-700 text-xs lg:text-lg hover:bg-black hover:text-white shadow-xl rounded-lg" onClick={()=> navigate('/')}>Save as Draft</button>
          <button className="w-[33%] md:w-[25%] px-3 md:px-7 py-2 font-semibold bg-white text-gray-700 text-xs lg:text-lg hover:bg-black hover:text-white shadow-xl rounded-lg">Regenerate Quiz</button>
          <button className="w-[33%] md:w-[25%] px-3 md:px-7 py-2 font-semibold bg-white text-gray-700 text-xs lg:text-lg hover:bg-black hover:text-white shadow-xl rounded-lg" onClick={()=> navigate('/quiz-setting')}>Continue</button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewQuiz
