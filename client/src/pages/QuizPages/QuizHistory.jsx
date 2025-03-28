import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/authUtils";

const QuizHistory = () => {
  const { userData } = useAuth();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [userQuiz, setUserQuiz] = useState([]);
  const getUserQuiz = async () => {
    const token = await userData.user.getIdToken();
    const response = await fetch(`${BASE_URL}/quiz/get-user-quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });
    const userQuiz = await response.json();
    setUserQuiz(prev =>[
      ...prev,
      userQuiz
    ]);
    console.log(userQuiz);
  };

  useEffect(() => {
    getUserQuiz();
  }, [userData]);

  return (
    <div className="w-full max-h-[100vh] flex flex-col items-end">
      <div className="w-full md:w-[77%]">
        <div className="p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mb-2">Your Quizzes</h2>
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col min-h-40">
          {userQuiz? userQuiz?.map((quiz, index) => (
            <div key={index} className="flex flex-col gap-2 text-left">
              <div className="flex flex-col md:flex-row items-center space-x-2 mb-2">
                
                <h3 className="text-lg font-semibold cursor-pointer"><span className="text-gray-500 mr-1">⏺</span>{quiz?.generatedQuiz?.quiz_details?.topic}</h3>
                <p>{quiz?.generatedQuiz?.quiz_details?.difficulty} Difficulty |</p>
                <p>{quiz?.generatedQuiz?.quiz_details?.number_of_questions} Questions |</p>
                <p>Type : {quiz?.generatedQuiz?.quiz_details?.type}</p>
              </div>

              <p className="text-gray-600">Math 101</p>
              <div className="flex items-center text-gray-500 text-sm mt-2">
                <span className="mr-4">📅 Due: January 2, 2025</span>
                <span>⏳ 20 min</span>
              </div>
              <hr className="text-gray-400 my-3" />
            </div>
          )): <p>Loading...</p>}
        </div>
        </div>  
      </div>
    </div>
  );
};

export default QuizHistory;
