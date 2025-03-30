import { useEffect, useState } from "react";
import { useAuth } from "../utils/authUtils";
import quizStore from "../store/quizStore";
import { useNavigate, Link } from "react-router-dom";

const StudentDashboard = () => {
  const { userData } = useAuth();
  const setClassQuiz = quizStore((state) => state.setClassQuiz);
  const navigate = useNavigate();
  const newQuiz = quizStore((state) => state.newQuiz);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  // Fetch class quizzes
  const getClassQuiz = async (classroomId) => {
    try {
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
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  };

  // Fetch classroom details
  const getClassroomDetails = async (classroomId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/class/get-classroom/${classroomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch classroom details");
      return response.json();
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      return null;
    }
  };

  // Get quiz scores for the student
  const getQuizScores = async () => {
    try {
      if (!userData?.user?.uid) return [];
      
      const response = await fetch(
        `${BASE_URL}/student/quiz-scores/${userData.user.uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch quiz scores");
      return response.json();
    } catch (error) {
      console.error("Error fetching quiz scores:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Only proceed if user has classrooms
        if (userData?.classrooms?.length > 0) {
          // Fetch quizzes for each classroom
          const quizzes = await Promise.all(
            userData.classrooms.map((id) => getClassQuiz(id))
          );
          setClassQuiz(quizzes.flat());
          
          // Fetch classroom details
          const classroomDetails = await Promise.all(
            userData.classrooms.map((id) => getClassroomDetails(id))
          );
          setClassrooms(classroomDetails.filter(Boolean));
          
          // Get quiz scores
          const scores = await getQuizScores();
          
          // Process quizzes into upcoming and completed
          const allQuizzes = quizzes.flat();
          
          // Map classroom details to quizzes
          const enhancedQuizzes = allQuizzes.map(quiz => {
            const classroom = classroomDetails.find(
              classroom => classroom?._id === quiz.classroomId
            );
            
            // Find score if completed
            const scoreInfo = scores.find(score => score.quizId === quiz._id);
            
            return {
              ...quiz,
              classroom: classroom || { name: "Unknown Class" },
              completed: Boolean(scoreInfo),
              score: scoreInfo?.score || 0
            };
          });
          
          // Split into upcoming and completed
          setUpcomingQuizzes(enhancedQuizzes.filter(quiz => !quiz.completed));
          setCompletedQuizzes(enhancedQuizzes.filter(quiz => quiz.completed));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userData, setClassQuiz]);

  const handleQuizClick = (quiz) => {
    newQuiz(quiz);
    navigate(`/display-quiz`);
  };
  
  const handleClassroomClick = (classroomId) => {
    navigate(`/classroom/${classroomId}`);
  };

  // Format the due date
  const formatDueDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* My Classes Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">My Classes</h2>
          <Link to="/join-classroom">
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition hover:cursor-pointer">
              Join New Class
            </button>
          </Link>
        </div>
        
        {loading ? (
          <div className="bg-white p-8 rounded-xl shadow-md flex justify-center items-center min-h-40">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <div
                key={classroom._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => handleClassroomClick(classroom._id)}
              >
                <h3 className="text-lg font-semibold">{classroom.name}</h3>
                <p className="text-gray-600 mb-2">{classroom.subject} • {classroom.gradeLevel}</p>
                <p className="text-gray-500 text-sm">
                  Teacher: {classroom.teacherName || "Not specified"}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {classroom.quizzes?.length || 0} quizzes
                  </span>
                  <span className="text-blue-600 font-semibold text-sm hover:underline">
                    View Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-md text-center min-h-40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 12h14" />
            </svg>
            <p className="text-gray-600 mb-3">You haven&apos;t joined any classes yet</p>
            <Link to="/join-classroom">
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition hover:cursor-pointer">
                Join Your First Class
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Quizzes Section */}
      <div>
        <h2 className="text-xl font-bold mb-3">Upcoming Quizzes</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center items-center min-h-80">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : upcomingQuizzes.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {upcomingQuizzes.map((quiz) => (
                <div key={quiz._id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-lg font-semibold cursor-pointer hover:text-blue-600 transition"
                        onClick={() => handleQuizClick(quiz)}
                      >
                        {quiz.title || "Untitled Quiz"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {quiz.classroom?.name || "Unknown Class"}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {quiz.status || "Active"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-gray-500 text-sm mt-3">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {formatDueDate(quiz.dueDate)}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.timeLimit || 20} min
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.number || 0} questions
                    </span>
                  </div>
                  <button
                    className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    onClick={() => handleQuizClick(quiz)}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <img 
                src="/assets/no-quizzes.svg" 
                alt="No quizzes" 
                className="w-24 h-24 mx-auto mb-4 text-gray-400"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <p className="text-gray-600 mb-2">No upcoming quizzes</p>
              <p className="text-gray-500 text-sm">
                Your teacher hasn&apos;t assigned any quizzes yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Quizzes Section */}
      <div>
        <h2 className="text-xl font-bold mb-3">Completed Quizzes</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center items-center min-h-40">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : completedQuizzes.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Quiz</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Date Completed</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {completedQuizzes.map((quiz) => (
                  <tr key={quiz._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <p className="font-medium">{quiz.title || "Untitled Quiz"}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {quiz.classroom?.name || "Unknown Class"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {formatDueDate(quiz.completedAt || quiz.updatedAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium min-w-[40px]">
                          {quiz.score}%
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 flex-grow max-w-[120px]">
                          <div 
                            className={`h-2.5 rounded-full ${
                              quiz.score >= 80 ? 'bg-green-600' : 
                              quiz.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${quiz.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600">You haven&apos;t completed any quizzes yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;