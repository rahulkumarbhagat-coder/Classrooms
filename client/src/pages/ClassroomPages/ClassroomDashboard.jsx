import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClassroom } from '../../utils/classroomUtils';
import { useAuth } from '../../utils/authUtils';

const ClassroomDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { classroomData, updateClassroom, generateInviteCode, deleteClassroom } = useClassroom();
    const { userData } = useAuth();

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [classroom, setClassroom] = useState(null);

    const handleNavigate = () => {
        if(userData.isTeacher) {
          return navigate(`/teacher/${userData.user?.uid}`);
        } else {
          navigate(`/student/${userData.user?.uid}`);
        }
      }

    // Find the current classroom from context based on ID
    useEffect(() => {
        console.log("Classroom ID from params:", id);
        console.log("Available classrooms:", classroomData.classrooms);
        
        if (classroomData.classrooms.length > 0) {
            const currentClass = classroomData.classrooms.find(
                classroom => classroom._id === id
            );
            console.log("Found classroom:", currentClass);
            setClassroom(currentClass);
            setLoading(false);
        }
    }, [classroomData.classrooms, id]);

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading || classroomData.loading) {
        return (
            <div className="flex-grow h-screen bg-gray-300 pl-72 flex items-center justify-center">
                <p>Loading classroom data...</p>
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="flex-grow h-screen bg-gray-300 pl-72 flex items-center justify-center">
                <p>Classroom not found</p>
            </div>
        );
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        if(!userData.user) {
            console.error('User not logged in');
            return;
        } else if(userData.isTeacher === false) {
            console.error('User does not have access to update classroom');
            alert('You do not have access to update a classroom');
            return;
        }

        const name = e.target.elements.name.value.trim();
        const subject = e.target.elements.subject.value.trim();
        const gradeLevel = e.target.elements.gradeLevel.value.trim();
        const description = e.target.elements.description.value.trim();

        const classDetails = {
            name,
            subject,
            gradeLevel,
            description,
        }

        console.log('CD: ',classDetails);
        console.log(classroom)
        try{
            await updateClassroom(classroom._id ,classDetails);
            alert(`${classDetails.name} classroom updated successfully!`);
            e.target.reset();

            window.location.reload();
        } catch(err) {  
            console.error(err);
            alert('Error updating classroom');
        }
    }

    const handleDelete = async () => {
        window.confirm("Are you sure you want to delete this classroom?")
        if(window.confirm) {
            deleteClassroom(classroom._id);
            navigate(`/teacher/${userData.user?.uid}`);
        }
    }

    const generateNewInviteCode = async () => {
        const newCode = await generateInviteCode();
        console.log("New invite code:", newCode);
        try {
            await updateClassroom(classroom._id, { 
                inviteCode: newCode,
                name: classroom.name,
                subject: classroom.subject,
                gradeLevel: classroom.gradeLevel,
                description: classroom.description
            });
            console.log("Invite code updated successfully");
        } catch (error) {  
            console.error("Error generating new invite code:", error);
            alert('Error generating new invite code');
        }
    }
    
    return (
        <div className="flex-grow h-screen bg-gray-300 pl-72 overflow-y-auto">
            {/* Header Section */}
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center mb-1">
                            <button 
                                className="mr-2 text-gray-600 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100"
                                onClick={() => navigate(-1)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <h1 className="text-2xl font-semibold">{classroom.name}</h1>
                        </div>
                        <p className="text-gray-500 ml-8">{classroom.subject} • {classroom.gradeLevel}</p>
                    </div>
                    
                    {/* Profile */}
                    <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center">
                            <img src="/Frame (3).svg" alt="" />
                        </div>
                        <div className="ml-3 text-left hover:cursor-pointer" onClick={handleNavigate}>
                            <p className="font-bold">{userData.user ? (<>{userData.firstName} {userData.lastName}</>) : ("Guest")}</p>
                            <p className="text-sm text-gray-500">{userData.isTeacher ? ("Teacher") : ("Student")}</p>
                        </div>
                        <img src="/weui_arrow-filled.svg" alt="" className="ml-2"/>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6">
                <div className="flex border-b border-gray-300">
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Students
                    </button>
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'quizzes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveTab('quizzes')}
                    >
                        Quizzes
                    </button>
                    {userData.isTeacher && (
                        <button 
                            className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6 text-left mt-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Classroom Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}>
                            <h2 className="text-lg font-medium mb-4">About This Class</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                    <p className="mt-1">{classroom.description || 'No description provided'}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                                        <p className="mt-1">{formatDate(classroom.createdOn)}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Invite Code</h3>
                                        <div className="flex items-center mt-1">
                                            <span className="font-mono bg-gray-100 px-3 py-1 rounded">{classroom.inviteCode}</span>
                                            <button 
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(classroom.inviteCode);
                                                }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                </svg>
                                            </button>
                                            <button 
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                onClick={generateNewInviteCode}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl shadow-sm p-6"
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Students</h3>
                                <p className="text-3xl font-bold">{classroom.students ? classroom.students.length : 0}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6"
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Quizzes</h3>
                                <p className="text-3xl font-bold">{classroom.quizzes ? classroom.quizzes.length : 0}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6"
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Teachers</h3>
                                <p className="text-3xl font-bold">{classroom.teachers ? classroom.teachers.length : 0}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="bg-white rounded-2xl shadow-sm p-6"
                        style={{ 
                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                        }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">Students</h2>
                        </div>
                        
                        {!classroom.students || classroom.students.length === 0 ? (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="mt-4 text-gray-500">No students have joined this class yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quizzes Completed
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Avg. Score
                                            </th>
                                            {userData.isTeacher && (
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {classroom.students.map((student, index) => (
                                            <tr key={student._id || index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {student.firstName} {student.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {/* Replace with actual join date if available */}
                                                    {formatDate(new Date())}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {/* Replace with actual quiz data when available */}
                                                    0/0
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {/* Replace with actual score data when available */}
                                                    N/A
                                                </td>
                                                {userData.isTeacher && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                        <button className="text-red-600 hover:text-red-900">Remove</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'quizzes' && (
                    <div className="bg-white rounded-2xl shadow-sm p-6"
                        style={{ 
                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                        }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">Quizzes</h2>
                            {userData.isTeacher && (
                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700">
                                    Create Quiz
                                </button>
                            )}
                        </div>
                        
                        {!classroom.quizzes || classroom.quizzes.length === 0 ? (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <p className="mt-4 text-gray-500">No quizzes have been created for this class yet</p>
                                {userData.isTeacher && (
                                    <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 hover:cursor-pointer">
                                        Create Your First Quiz
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {classroom.quizzes.map((quiz, index) => (
                                    <div key={quiz._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{quiz.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {quiz.questions ? `${quiz.questions.length} questions` : 'No questions'} • 
                                                    Created on {formatDate(quiz.createdAt || new Date())}
                                                </p>
                                            </div>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                                                {quiz.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                            <span>{quiz.completions || 0} students completed</span>
                                            <span className="mx-2">•</span>
                                            <span>Avg. score: {quiz.averageScore || 'N/A'}</span>
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <button className="text-blue-600 hover:text-blue-800">
                                                View Details
                                            </button>
                                            {userData.isTeacher && (
                                                <div>
                                                    <button className="text-gray-600 hover:text-gray-800 mr-2">
                                                        Edit
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab (Teachers Only) */}
                {activeTab === 'settings' && userData.isTeacher && (
                    <div className="bg-white rounded-2xl shadow-sm p-6"
                        style={{ 
                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                        }}>
                        <h2 className="text-lg font-medium mb-6">Class Settings</h2>
                        
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    defaultValue={classroom.name}
                                    className="w-1/2 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name='subject'
                                    defaultValue={classroom.subject}
                                    className="w-1/2 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                                <div className="relative w-1/2">
                                    <select
                                        defaultValue={classroom.gradeLevel}
                                        name='gradeLevel'
                                        className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-10"
                                        style={{ 
                                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                        }}
                                        required
                                    >
                                        <option value="Elementary">Elementary</option>
                                        <option value="Middle School">Middle School</option>
                                        <option value="High School">High School</option>
                                        <option value="College">College</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    defaultValue={classroom.description}
                                    name='description'
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="border-b border-gray-200 pb-6 mb-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 hover:cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                            
                        </form>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Regenerate Invite Code</label>
                            <div className="flex items-center">
                                <span className="font-mono bg-gray-100 px-3 py-2 rounded mr-2">{classroom.inviteCode}</span>
                                <button 
                                    type="button"
                                    onClick={generateNewInviteCode}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:cursor-pointer">
                                    Regenerate
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Warning: This will invalidate the current class code
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Danger Zone</h3>
                            <button 
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:cursor-pointer"
                            >
                                Delete Class
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                This action cannot be undone. All class data will be permanently removed.
                            </p>
                        </div>
                    
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassroomDashboard;