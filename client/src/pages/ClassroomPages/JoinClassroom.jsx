import { useAuth } from "../../utils/authUtils";
import { useClassroom } from "../../utils/classroomUtils";

function JoinClassroom() {

    const { userData } = useAuth();
    const { joinClassroom } = useClassroom();

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!userData.user) {
            console.error('User not logged in');
            return;
        } else if(userData.isTeacher === true) {
            console.error('User is not a student');
            alert('User is not a student');
            return;
        }

        joinClassroom(e.target.elements.inviteCode.value.trim());
    }
    
    return (
        <div className="w-full md:w-[600px] mx-auto mt-5 px-4 md:px-0">
            <div className="rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-emerald-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                    Join a classroom
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Invite Code */}
                    <div className="space-y-2">
                        <label 
                            className="block text-left text-sm px-1 font-bold text-gray-700"
                            htmlFor="inviteCode">
                                Class invite code
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                            placeholder="Enter the subject or topic"
                            id="inviteCode"
                            name="inviteCode"
                            required
                        />
                    </div>

                    {/* Join Button */}
                    <button
                        type="submit"
                        className="w-full !bg-emerald-600 text-white hover:!bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                            Join Class
                    </button>
                </form>
            </div>
        </div>
  
    );
}

export default JoinClassroom;