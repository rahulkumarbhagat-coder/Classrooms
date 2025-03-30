import { useState } from "react";
import { useAuth } from "../../utils/authUtils";
import { useClassroom } from "../../utils/classroomUtils";
import { useNavigate } from 'react-router-dom';

function JoinClassroom() {

    const { userData } = useAuth();
    const { joinClassroom } = useClassroom();

    const [error,setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null);

        if(!userData.user) {
            console.error('User not logged in');
            return;
        } else if(userData.isTeacher === true) {
            console.error('User is not a student');
            alert('User is not a student');
            return;
        }

        try {
            const inviteCode = e.target.elements.inviteCode.value.trim();
            const joinedClass = await joinClassroom(inviteCode);
            const isConfirmed = window.confirm(`You have joined the class ${joinedClass.className}!`);
            if(isConfirmed) {
                navigate(`/classroom/${joinedClass._id}`); 
            }
        } catch (err) {
            console.error("Error joining classroom:", err);
            setError(err.message || 'Failed to join classroom');
        }
    }

    const handleNavigate = () => {
        if(userData.isTeacher) {
          return navigate(`/teacher/${userData.user?.uid}`);
        } else {
          navigate(`/student/${userData.user?.uid}`);
        }
      }
    
    return (
        <div className="flex-grow h-screen bg-gray-300 pl-72">
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
                            <h1 className="text-2xl font-semibold">Join Class</h1>
                        </div>
                        <p className="text-gray-500 ml-8">Enter your class code to join a classroom</p>
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

            {/* Main Content */}
            <div className="px-6 pb-6 text-left">
                <form onSubmit={handleSubmit}>
                    {/* Join Class Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6"
                        style={{ 
                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                        }}>
                        <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Class Invitation</h2>
                        {/* Instructions */}
                            <p className="text-gray-500">
                                Get the 6-character class code from your teacher and enter it below
                            </p>
                        </div>
                        
                        {/* Invite Code with Icon */}
                        <div className="space-y-2">
                            <label 
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="inviteCode">
                                    Class invite code
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-1/2 pl-10 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter 6-character code (e.g., AB12CD)"
                                    id="inviteCode"
                                    name="inviteCode"
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Class codes are not case sensitive
                            </p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Help Section */}
                        <div className="my-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Can&apos;t find your code? Ask your teacher for help.</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 hover:cursor-pointer"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}
                            >
                            Join Classroom
                        </button>

                    </div>

                </form>
            </div>
        </div>
  
    );
}

export default JoinClassroom;