import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authUtils";
import { useClassroom } from "../utils/classroomUtils";

const TeacherDashboard = () => {
    const { userData } = useAuth();
    const { fetchClassrooms, classroomData } = useClassroom();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        // Fetch classrooms when component mounts
        if (userData.user && !classroomData.loading) {
            fetchClassrooms();
        }
    }, [userData.user, fetchClassrooms, classroomData.loading]);

    // Extract all unique students from all classrooms
    useEffect(() => {
        if (classroomData.classrooms.length > 0) {
            // Collect all students from all classrooms
            const studentMap = new Map(); // To track unique students

            classroomData.classrooms.forEach(classroom => {
                if (classroom.students && classroom.students.length > 0) {
                    classroom.students.forEach(student => {
                        // If we haven't seen this student before
                        if (!studentMap.has(student._id)) {
                            studentMap.set(student._id, {
                                ...student,
                                classes: [classroom],
                                quizzesTaken: 0, // You'll need to calculate this
                                averageScore: 0  // You'll need to calculate this
                            });
                        } else {
                            // Add this classroom to existing student's classes
                            const existingStudent = studentMap.get(student._id);
                            existingStudent.classes.push(classroom);
                        }
                    });
                }
            });

            // Convert Map values to array
            setStudents(Array.from(studentMap.values()));
        }
    }, [classroomData.classrooms]);

    // Apply filters
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

    const handleNavigate = () => {
        if(userData.isTeacher) {
        return navigate(`/teacher/${userData.user?.uid}`);
        } else {
        navigate(`/student/${userData.user?.uid}`);
        }
    }
  
  return (
    <div className="flex-grow h-screen bg-gray-300 pl-72 overflow-y-auto">
      {/* Main Content */}
      <div className="p-6">
            {/* Header Section */}
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center mb-1">
                        <button 
                            className="mr-2 text-gray-600 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 hover:cursor-pointer"
                            onClick={() => navigate(-1)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                            <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
                        </div>
                        <p className="text-gray-500 ml-8">Manage Classes and Students</p>
                    </div>
                    
                    {/* Profile */}
                    <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center">
                            <img src="Frame (3).svg" alt="" />
                        </div>
                        <div className="ml-3 text-left hover:cursor-pointer" onClick={handleNavigate}>
                            <p className="font-bold">{userData.user ? (<>{userData.firstName} {userData.lastName}</>) : ("Guest")}</p>
                            <p className="text-sm text-gray-500">{userData.isTeacher ? ("Teacher") : ("Student")}</p>
                        </div>
                        <img src="weui_arrow-filled.svg" alt="" className="ml-2"/>
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
            onClick={() => navigate('/create-class')}>
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
                onClick={navigate('/create-class')}
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
                    <div className="grid grid-cols-4 py-3 px-4 border-b border-gray-200 bg-gray-50">
                        <div className="text-xs font-medium text-gray-500 uppercase">Student</div>
                        <div className="text-xs font-medium text-gray-500 uppercase">Classes</div>
                        <div className="text-xs font-medium text-gray-500 uppercase">Quizzes Taken</div>
                        <div className="text-xs font-medium text-gray-500 uppercase">Average Score</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <div key={student._id} className="grid grid-cols-4 py-4 px-4 items-center hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-gray-200 h-10 w-10 flex items-center justify-center mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {student.classes.map(cls => (
                                            <span key={cls._id} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                                                {cls.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-gray-800">{student.quizzesTaken}</div>
                                    <div>
                                        <div className="flex items-center">
                                            <span className="mr-2 font-medium">{student.averageScore}%</span>
                                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className="bg-green-600 h-2.5 rounded-full" 
                                                    style={{ width: `${student.averageScore}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                No students found in this class
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;