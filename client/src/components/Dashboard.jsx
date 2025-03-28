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

    console.log(userData);
    

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
      <div className="flex gap-3 md:gap-5">
          {quizzes?.length > 0 && (
              <Link to={"/generate-quiz"}>
                    <button className="m-5 px-2 py-2 md:px-4 md:py-2 bg-black text-sm md:text-lg text-white rounded-lg cursor-pointer">
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
            </div>
          <div className="bg-white shadow-xl min-h-40 max-h-[80vh] rounded-lg p-3 overflow-y-scroll">
            <div className="text-center p-6">
              {quizzes?.length === 0 ? (
                <div>
                  <p className="font-semibold text-xl md:text-2xl text-gray-500">
                    You haven't created any quizzes yet
                  </p>
                  <p className="text-sm md:text-lg text-gray-400">
                    Your AI-generated quizzes will appear here
                  </p>
                  <Link to={"/generate-quiz"}>
                    <button className="m-5 px-2 md:px-4 py-2 text-sm md:text-lg bg-black text-white rounded-lg cursor-pointer">
                      + Create new quiz
                    </button>
                  </Link>
                  <div className="flex justify-center">
                    <img src="Hyperspace Mr Roboto.svg" alt="" />
                  </div>
                </div>
              ) : (
                quizzes?.map((quiz, index) => (
                  <div key={index} className={`p-4 bg-gray-${quiz.status==='active'? '100': '600'} rounded-lg shadow-md mt-2 lg:h-25 flex flex-col md:flex-row gap-3 justify-start items-start md:justify-between md:items-center`}>
                    <div className='flex flex-col md:flex-row gap-3 md:items-center'>
                      <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                        <p className={`font-semibold cursor-pointer text-${quiz.status==='active'? 'gray-600': 'white'} text-left md:w-35`} onClick={()=> handleClick(quiz)}>{(quiz?.generatedQuiz?.quiz_details?.topic.trim()) || "Untitled Quiz"}</p>
                        <span className="text-xs bg-gray-300 text-gray-700 md:mx-5 px-2 py-1 w-15 h-6 rounded">{quiz.status}</span>
                      </div>
                      
                      <p className={`text-sm text-${quiz.status==='active'? 'gray-600': 'white'} text-left`}>• {`${quiz.type} ` || "Unknown Type"} • {quiz.number || 0} Questions</p>
                    </div>
                    <div className={`text-sm text-${quiz.status==='active'? 'gray-500': 'white'} text-left`}>Created At {new Date(quiz.createdOn).toLocaleString()}</div>
                    <div className="flex gap-5 w-30">
                      <button className="text-gray-600 hover:text-black cursor-pointer" onClick={()=> {newQuiz(quiz); navigate('/review-quiz')}}>
                        <span className="material-icons"><img src={quiz.status==='active'? "Vector.svg" : "Vector (10).svg"} alt="" /></span>
                      </button>
                      <button className="text-gray-600 hover:text-black cursor-pointer" onClick={()=> deleteQuiz(quiz._id)}>
                        <span className="material-icons"><img src={quiz.status==='active'? "Vector (1).svg" : "Vector (11).svg"} alt="" /></span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>
          

          {/* My Classes */}
          <div className="mt-4">
            <div className="flex justify-between items-center p-2">
              <h2 className="text-lg font-bold">My Classes</h2>
            </div>
            <div className="bg-white shadow-xl rounded-lg p-4">
            <div className="text-center p-6">
              {classes.length === 0 ? (
                <div>
                  <p className="font-semibold text-xl md:text-2xl text-gray-500">
                    You don't have any classes yet
                  </p>
                  <p className="text-sm md:text-lg p-2 text-gray-400">
                    Classes help you organize students and assign quizzes
                  </p>

                  {/* Create/Join Classroom button   */}
                    <Link to={"/create-classroom"}>
                      <button
                        className="m-5 px-2 md:px-4 py-2 text-sm md:text-lg bg-black text-white rounded-lg cursor-pointer"
                      >
                        + Add class
                      </button>{" "}
                    </Link>

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
