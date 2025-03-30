import { useEffect, useState } from 'react'
import { useAuth } from "../utils/authUtils";
import { useClassroom } from '../utils/classroomUtils';
import { Link, useNavigate } from 'react-router-dom'
import quizStore from '../store/quizStore';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const Dashboard = ({classes = []}) => { // Default to empty array
    const { userData } = useAuth();
    const quizzes = quizStore((state => state.allQuizzes))
    const setAllQuiz = quizStore((state => state.setAllQuiz))
    const newQuiz = quizStore((state) => state.newQuiz)
    const navigate = useNavigate()
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

    const { fetchClassrooms, classroomData } = useClassroom();

    const [students, setStudents] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredStudents, setFilteredStudents] = useState([]);
    

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

    // Fetch classrooms when component mounts
    useEffect(() => {
        if (userData.user && !classroomData.loading) {
            fetchClassrooms();
        }
    }, [userData.user, fetchClassrooms, classroomData.loading]);

    // Extract student IDs from all classrooms
    useEffect(() => {
        if (classroomData.classrooms.length > 0) {
            // Collect unique student IDs from all classrooms
            const uniqueStudentIds = new Set();
            const studentClassMap = new Map(); 
            
            classroomData.classrooms.forEach(classroom => {
                if (classroom.students && classroom.students.length > 0) {
                    classroom.students.forEach(studentId => {
                        uniqueStudentIds.add(studentId);
                        
                        // Track classroom for each student
                        if (!studentClassMap.has(studentId)) {
                            studentClassMap.set(studentId, [classroom]);
                        } else {
                            studentClassMap.get(studentId).push(classroom);
                        }
                    });
                }
            });
            
            // Now fetch details for these student IDs
            const fetchStudentDetails = async () => {
                try {
                    const token = await userData.user.getIdToken();
                    const studentIds = Array.from(uniqueStudentIds);
                    
                    if (studentIds.length === 0) {
                        setStudents([]);
                        setFilteredStudents([]);
                        return;
                    }
                    
                    const response = await fetch(`${BASE_URL}/class/students-in-class`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ studentIds })
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch student details');
                    }
                    
                    const studentDetails = await response.json();
                    console.log("Fetched student details:", studentDetails);
                    
                    // Combine student details with their class information
                    const enhancedStudents = studentDetails.map(student => ({
                        ...student,
                        classes: studentClassMap.get(student._id) || [],
                    }));
                    
                    setStudents(enhancedStudents);
                } catch (error) {
                    console.error("Error fetching student details:", error);
                    setStudents([]);
                }
            };
            
            fetchStudentDetails();
        } else {
            setStudents([]);
        }
    }, [classroomData.classrooms, userData.user, BASE_URL]);

    // Apply filters to students based on selected class
    useEffect(() => {
        let result = [...students];
        
        // Apply class filter
        if (activeFilter !== "all") {
            result = result.filter(student => 
                student.classes.some(cls => cls._id === activeFilter)
            );
        }
        
        setFilteredStudents(result);
    }, [students, activeFilter]);

    const handleFilterChange = (classId) => {
        setActiveFilter(classId);
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
          {classes.length > 0 && (userData.isTeacher ? (
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
          <div className='mb-6'>
            <div className="flex justify-between items-center p-2">
              <h2 className="text-lg font-bold">Recent Quizzes</h2>
            </div>
          <div className="bg-white shadow-xl min-h-40 max-h-[80vh] rounded-lg p-3 overflow-y-scroll">
            <div className="text-center p-6">
              {quizzes?.length === 0 ? (
                <div>
                  <p className="font-semibold text-xl md:text-2xl text-gray-500">
                    You haven&apos;t created any quizzes yet
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
                        <p className={`font-semibold cursor-pointer text-${quiz.status==='active'? 'gray-600': 'white'} text-left md:w-35`} onClick={()=> handleClick(quiz)}>{quiz?.title || "Untitled Quiz"}</p>
                        <span className="text-xs bg-gray-300 text-gray-700 md:mx-5 px-2 py-1 w-15 h-6 rounded">{quiz.status}</span>
                      </div>
                      
                      <p className={`text-sm text-${quiz.status==='active'? 'gray-600': 'white'} text-left`}>• {quiz.type || "Unknown Type"} • {quiz.number || 0} Questions</p>
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
          

          {/* Classes Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6"
              style={{ 
                  boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
              }}>
              <div className="flex justify-between items-center mb-4">
                  <div>
                      <p className="text-lg font-medium">Your Classes</p>
                      <p className="text-sm text-gray-500">Total: {classroomData.classrooms.length}</p>
                  </div>
                  <button 
                      className="bg-black text-white rounded-lg px-3 py-2 flex items-center hover:bg-gray-700 hover:cursor-pointer"
                      onClick={() => navigate('/create-classroom')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add class
                  </button>
              </div>
              
              {classroomData.classrooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classroomData.classrooms.map(classroom => (
                          <div 
                              key={classroom._id} 
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                              onClick={() => navigate(`/classroom/${classroom._id}`)}
                          >
                              <h3 className="font-medium text-lg mb-1">{classroom.name}</h3>
                              <p className="text-sm text-gray-500 mb-2">{classroom.subject} • {classroom.gradeLevel}</p>
                              <div className="flex justify-between items-center">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                      {classroom.students ? classroom.students.length : 0} students
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      {classroom.quizzes ? classroom.quizzes.length : 0} quizzes
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 12h14" />
                      </svg>
                      <p className="text-gray-500 mb-2">You haven&apos;t created any classes yet</p>
                      <button 
                          className="mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                          onClick={() => navigate('/create-classroom')}
                      >
                          Create Your First Class
                      </button>
                  </div>
              )}
          </div>

          {/* Class Filters */}
          <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by Class</p>
              <div className="flex flex-wrap gap-2">
                  <button 
                      className={`${activeFilter === "all" ? "bg-black text-white" : "bg-white border border-gray-300 text-gray-700"} px-3 py-1 rounded-full text-sm`}
                      onClick={() => handleFilterChange("all")}
                  >
                      All Students
                  </button>
                  
                  {classroomData.classrooms.map(classroom => (
                      <button 
                          key={classroom._id}
                          className={`${activeFilter === classroom._id ? "bg-black text-white" : "bg-white border border-gray-300 text-gray-700"} px-3 py-1 rounded-full text-sm flex items-center`}
                          onClick={() => handleFilterChange(classroom._id)}
                      >
                          {classroom.name}
                          <span className="ml-1 text-xs bg-gray-200 px-1 rounded">
                              ({classroom.students ? classroom.students.length : 0})
                          </span>
                      </button>
                  ))}
              </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6"
              style={{ 
                  boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
              }}>
              {/* Table Headers */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-xs font-medium text-gray-500 uppercase text-left py-3 px-6">Student</th>
                    <th className="text-xs font-medium text-gray-500 uppercase text-left py-3 px-6">Classes</th>
                    <th className="text-xs font-medium text-gray-500 uppercase text-center py-3 px-6">Quizzes Taken</th>
                    <th className="text-xs font-medium text-gray-500 uppercase text-left py-3 px-6">Average Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <p className="font-medium truncate">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-gray-500 truncate">{student.email}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                            {student.classes.map(cls => (
                              <span key={cls._id} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded truncate max-w-[120px]">
                                {cls.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="text-gray-800">{student.quizzesTaken}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <span className="mr-2 font-medium min-w-[40px]">{student.averageScore}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2.5 flex-grow max-w-[120px]">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${student.averageScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No students found in this class
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
    </div>
  )
}

// Add PropTypes validation for the component
Dashboard.propTypes = {
  classes: PropTypes.array 
};

// Default props
Dashboard.defaultProps = {
  classes: []
};

export default Dashboard