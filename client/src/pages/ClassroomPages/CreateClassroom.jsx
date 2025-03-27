import { useAuth } from "../../utils/authUtils";
import { useClassroom } from "../../utils/classroomUtils";

function CreateClassroom() {

    const { userData } = useAuth();
    const { createClassroom } = useClassroom();

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

            createClassroom(classDetails);

            alert(`${classDetails.name} classroom created successfully!`);
            e.target.reset();
    }
    
    return (
        <div className="flex-grow h-screen bg-gray-100 pl-72">
            {/* Header Section */}
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center mb-1">
                            <button className="mr-2 text-gray-600">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <div className="ml-3 text-left">
                            <p className="font-bold">{userData.user ? (<>{userData.firstName} {userData.lastName}</>) : ("Guest")}</p>
                            <p className="text-sm text-gray-500">{userData.isTeacher ? ("Teacher") : ("Student")}</p>
                        </div>
                        <img src="weui_arrow-filled.svg" alt="" className="ml-2"/>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6">
                <form onSubmit={handleSubmit}>
                    {/* Class Information Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-medium mb-6">Class Information</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Math 101, Biology 101"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="e.g. Mathematics, Social Studies"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade level</label>
                                <select
                                    name="gradeLevel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                                    required
                                >
                                    <option value="">Select grade level</option>
                                    <option value="elementary">Elementary</option>
                                    <option value="middle">Middle School</option>
                                    <option value="high">High School</option>
                                    <option value="college">College</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    placeholder="Add a brief description of your class"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button 
                            type="button"
                            className="px-6 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800"
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