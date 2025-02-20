
function CreateClassroom() {

    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log('Creating classroom...');
        try {
            const name = e.target.elements.name.value;
            const description = e.target.elements.description.value;

            const classDetails = {
                name,
                description,
            }

            console.log('CD: ',classDetails);

            const response = await fetch('http://localhost:5000/class/new-classroom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ classDetails })
            });

            console.log(response)

            if(!response.ok) {
                throw new Error('Failed to create test')
            }

            alert('Classroom created successfully!')
        } catch (error) {
            console.error('Error creating the quiz:', error)
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