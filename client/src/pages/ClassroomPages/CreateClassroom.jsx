import { useAuth } from "../../utils/authUtils";

function CreateClassroom() {

    const { userData } = useAuth();

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

        try {
            const name = e.target.elements.name.value.trim();
            const description = e.target.elements.description.value.trim();

            const classDetails = {
                name,
                description,
            }

            console.log('CD: ',classDetails);


            const token = await userData.user.getIdToken();
            
            const response = await fetch('http://localhost:5000/class/new-classroom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ classDetails })
            });

            console.log(await response.json())

            if(!response.ok) { 
                throw new Error('Failed to create test')
            }
            alert(`${classDetails.name} classroom created successfully!`);
            e.target.reset();
            
        } catch (error) {
            console.error('Error creating classroom:', error)
        }
    }
    
    return (
        <div className="w-full md:w-[600px] mx-auto mt-5 px-4 md:px-0">
            <div className="rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-emerald-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                    Create a new classroom
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Classroom name */}
                    <div className="space-y-2">
                        <label 
                            className="block text-left text-sm px-1 font-bold text-gray-700"
                            htmlFor="name">
                                Class title
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                            placeholder="Enter the subject or topic"
                            id="name"
                            name="name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label 
                            className="block text-left text-sm px-1 font-bold text-gray-700"
                            htmlFor="description">
                                Description
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                            placeholder="Enter the subject or topic"
                            id="description"
                            name="description"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full !bg-emerald-600 text-white hover:!bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                            Create Class
                    </button>
                </form>
            </div>
        </div>
  
    );
}

export default CreateClassroom;