import { useAuth } from "../../utils/authUtils";
import { useClassroom } from "../../utils/classroomUtils";
import { useNavigate, Link } from 'react-router-dom';

function CreateClassroom() {

    const { userData } = useAuth();
    const { createClassroom } = useClassroom();

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!userData.user) {
            console.error('User not logged in');
            return;
        } else if(userData.isTeacher === false) {
            console.error('User does not have access to create classroom');
            alert('You do not have access to create a classroom');
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
            try{
                const newClassroom = await createClassroom(classDetails);
                alert(`${classDetails.name} classroom created successfully!`);
                e.target.reset();

                navigate(`/classroom/${newClassroom._id}`);
            } catch(err) {  
                console.error(err);
                alert('Error creating classroom');
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
                            <h1 className="text-2xl font-semibold">New Class</h1>
                        </div>
                        <p className="text-gray-500 ml-8">Create a class to organize your students and quizzes</p>
                    </div>
                    
                    {/* Profile */}
                    <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center">
                            <img src="Frame (3).svg" alt="" />
                        </div>
                        <Link to="/" className="ml-3 text-left hover:cursor-pointer">
                            <p className="font-bold">{userData.user ? (<>{userData.firstName} {userData.lastName}</>) : ("Guest")}</p>
                            <p className="text-sm text-gray-500">{userData.isTeacher ? ("Teacher") : ("Student")}</p>
                        </Link>
                        <img src="weui_arrow-filled.svg" alt="" className="ml-2"/>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6 text-left">
                <form onSubmit={handleSubmit}>
                    {/* Class Information Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6"
                        style={{ 
                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                        }}>
                        <h2 className="text-lg font-medium mb-6">Class Information</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Math 101, Biology 101"
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
                                    name="subject"
                                    placeholder="e.g. Mathematics, Social Studies"
                                    className="w-1/2 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade level</label>
                                <div className="relative w-1/2">
                                    <select
                                        name="gradeLevel"
                                        className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-10 text-gray-500"
                                        style={{ 
                                            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                        }}
                                        required
                                    >
                                        <option value="">Select grade level</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    placeholder="Add a brief description of your class"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button 
                            type="button"
                            className="px-6 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 hover:cursor-pointer"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}
                        >
                            Create Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClassroom;