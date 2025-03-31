import React, { useEffect } from "react";
import { useAuth } from "../utils/authUtils";
import quizStore from "../store/quizStore";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { userData } = useAuth();
  const allClassQuizzes = quizStore((state) => state.classQuizzes);
  const setClassQuiz = quizStore((state) => state.setClassQuiz);
  const navigate = useNavigate()
  const newQuiz = quizStore((state) => state.newQuiz)
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const getClassQuiz = async (classroomId) => {
    const response = await fetch(
      `${BASE_URL}/quiz/get-class-quiz/${classroomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return response.json();
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizzes = await Promise.all(
          userData.classrooms.map((id) => getClassQuiz(id))
        );
        setClassQuiz(quizzes);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchQuiz();
  }, [userData]);

  useEffect(() => {
    console.log(allClassQuizzes);
  }, [allClassQuizzes]);
  
  const handleClick = (quiz) =>{
      newQuiz(quiz)
      navigate(`/display-quiz`)
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* My Classes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">My Classes</h2>
        <div className="bg-white p-6 rounded-xl shadow-md min-h-40">
          <h3 className="text-lg font-semibold">Math 101</h3>
          <p className="text-gray-600">Mr. Smith</p>
          <button className="mt-4 text-blue-500 font-semibold">
            View Class Details
          </button>
        </div>
      </div>

      {/* Upcoming Quizzes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Upcoming Quizzes</h2>
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col min-h-80">
          {!allClassQuizzes.length > 0 ?
          <div className="w-20 h-20 self-center border-4 border-white whitespace-nowrap"><p>No Quiz Available</p></div>
          :
          <> 
          {allClassQuizzes?.map((classQuiz, classIndex) =>(
            <div key={classIndex} className="flex flex-col gap-4">
            {classQuiz?.map((quiz, quizIndex)=>(
              <div key={quizIndex}>
                  <div className="flex items-center space-x-2 mb-2">
            <span className="text-gray-500">⏺</span>
            <h3 className="text-lg font-semibold cursor-pointer" onClick={()=> handleClick(quiz)}>
              {quiz?.title}
            </h3>
          </div>
          <p className="text-gray-600">Math 101</p>
          <div className="flex items-center text-gray-500 text-sm mt-2">
            <span className="mr-4">📅 Due: January 2, 2025</span>
            <span>⏳ 20 min</span>
          </div>
              <hr className="text-gray-400 my-3"/>
            </div>
          ))}
        </div>
          ))}
          </>
        }
          
          
          
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
