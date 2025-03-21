import React, { useEffect } from 'react'
import { useAuth } from "../utils/authUtils";
import { Link, useNavigate } from 'react-router-dom'
import quizStore from '../store/quizStore';

const Dashboard = ({classes}) => {
    const { userData } = useAuth();
    const quizzes = quizStore((state => state.allQuizzes))
    const setAllQuiz = quizStore((state => state.setAllQuiz))
    const newQuiz = quizStore((state) => state.newQuiz)
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'


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

    const handleClick = (quiz) =>{
      if (quiz.status === 'active') {
        newQuiz(quiz)
        navigate(`/display-quiz`)
      }
      else{
        newQuiz(quiz)
        navigate(`/quiz-setting`)
      }
    }

    const deleteQuiz = async(id) =>{
      const response = await fetch(`${BASE_URL}/quiz/delete-quiz`, {
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id})
      })
      const result = await response.json()
      console.log(result);
      getAllQuiz() 
    }
    
  return (
    <div>
      <div className="flex gap-5">
          {quizzes?.length > 0 && (
              <Link to={"/generate-quiz"}>
                    <button className="m-5 px-4 py-2 bg-black text-white rounded-lg cursor-pointer">
                      + Create new quiz
                    </button>
                  </Link>
          )}
          {classes?.length > 0 && (userData.isTeacher ? (
                    <Link to={"/create-classroom"}>
                      <button
                        className="m-5 px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
                      >
                        + Add class
                      </button>{" "}
                    </Link>
                  ) : (
                    <Link to={"/join-classroom"}>
                      <button
                        className="m-5 px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
                      >
                        Join class
                      </button>
                    </Link>
                  ))}
          </div>
          {/* Recent Quizzes */}
          <div>
            <div className="flex justify-between items-center p-2">
              <h2 className="text-lg font-bold">Recent Quizzes</h2>
              <Link to="/quizzes" className="text-[#7E7E7E] font-semibold text-sm">
                View All
              </Link>
            </div>
          <div className="bg-white shadow-xl min-h-72 rounded-lg p-3">
            <div className="text-center p-6">
              {quizzes?.length === 0 ? (
                <div>
                  <p className="font-semibold text-2xl text-gray-500">
                    You haven't created any quizzes yet
                  </p>
                  <p className="text-lg text-gray-400">
                    Your AI-generated quizzes will appear here
                  </p>
                  <Link to={"/generate-quiz"}>
                    <button className="m-5 px-4 py-2 bg-black text-white rounded-lg cursor-pointer">
                      + Create new quiz
                    </button>
                  </Link>
                  <div className="flex justify-center">
                    <img src="Hyperspace Mr Roboto.svg" alt="" />
                  </div>
                </div>
              ) : (
                quizzes?.map((quiz, index) => (
                  <div key={index} className={`p-4 bg-gray-${quiz.status==='active'? '100': '600'} rounded-lg shadow-md mt-4 flex justify-between items-center`}>
                    <div>
                      <p className={`font-semibold cursor-pointer text-${quiz.status==='active'? 'gray-600': 'white'}`} onClick={()=> handleClick(quiz)}>{quiz?.generatedQuiz?.quiz_details?.topic || "Untitled Quiz"} <span className="text-xs bg-gray-300 text-gray-700 mx-5 px-2 py-1 rounded">{quiz.status}</span></p>
                      <p className={`text-sm text-${quiz.status==='active'? 'gray-600': 'white'} text-left`}>• {quiz.type || "Unknown Type"} • {quiz.number || 0} Questions</p>
                    </div>
                    <div className={`text-sm text-${quiz.status==='active'? 'gray-500': 'white'}`}>Created At {new Date(quiz.createdOn).toLocaleString()}</div>
                    <div className="flex gap-5">
                      <button className="text-gray-600 hover:text-black cursor-pointer" onClick={()=> {newQuiz(quiz); navigate('/review-quiz')}}>
                        <span className="material-icons"><img src="Vector.svg" alt="" /></span>
                      </button>
                      <button className="text-gray-600 hover:text-black cursor-pointer" onClick={()=> deleteQuiz(quiz._id)}>
                        <span className="material-icons"><img src="Vector (1).svg" alt="" /></span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>
          

          {/* My Classes */}
          <div className="">
            <div className="flex justify-between items-center p-2">
              <h2 className="text-lg font-bold">My Classes</h2>
              <Link to="/classes" className="text-[#7E7E7E] font-semibold text-sm">
                View All
              </Link>
            </div>
            <div className="bg-white shadow-xl rounded-lg p-4">
            <div className="text-center p-6">
              {classes.length === 0 ? (
                <div>
                  <p className="font-semibold text-2xl text-gray-500">
                    You don't have any classes yet
                  </p>
                  <p className="text-lg text-gray-400">
                    Classes help you organize students and assign quizzes
                  </p>

                  {/* Create/Join Classroom button   */}
                  {userData.isTeacher ? (
                    <Link to={"/create-classroom"}>
                      <button
                        className="m-5 px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
                      >
                        + Add class
                      </button>{" "}
                    </Link>
                  ) : (
                    <Link to={"/join-classroom"}>
                      <button
                        className="m-5 px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
                      >
                        Join class
                      </button>
                    </Link>
                  )}
                  <div className="flex justify-center">
                    <img src="Hyperspace Perfect Landing.svg" alt="" />
                  </div>
                </div>
              ) : (
                <div>{/* Render classes here */}</div>
              )}
            </div>
          </div>
          </div>
    </div>
  )
}

export default Dashboard
