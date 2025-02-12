
function GenerateQuizForm() {
    return (
        <div className="w-xl">
            <div className="rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-emerald-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">
                Create your Quiz!
                </h2>
            </div>

            <form className="p-6 space-y-6">
                
                {/* Quiz Topic */}
                <div className="space-y-2">
                    <label 
                        className="block text-left text-sm px-1 font-bold text-gray-700"
                        htmlFor="quiz-topic">
                        Quiz Topic
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                        placeholder="Enter the subject or topic"
                        id="quiz-topic"
                    />
                </div>

                {/* Quiz Difficulty */}
                <div className="space-y-2">
                    <label 
                        className="block text-left text-sm px-1 font-bold text-gray-700"
                        htmlFor="quiz-difficulty">
                            Difficulty Level
                    </label>
                    <select 
                        className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                        id="quiz-difficulty">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                    </select>
                </div>

                {/* Quiz Type */}
                <div className="space-y-2">
                    <label 
                        className="block text-left text-sm px-1 font-bold text-gray-700"
                        htmlFor="quiz-type">
                            Quiz Type
                    </label>
                    <select 
                        className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                        id="quiz-type">
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                    </select>
                </div>

                {/* Number of Questions */}
                <div className="space-y-2">
                    <label 
                        className="block text-left text-sm px-1 font-bold text-gray-700"
                        htmlFor="quiz-type">
                            Number of Questions
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                        placeholder="Enter number of questions"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full !bg-emerald-600 text-white hover:!bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                        Generate Quiz!
                </button>
            </form>
            </div>

            <div className="text-center mt-6 text-gray-600 text-sm">
                Ready to boost your knowledge? 
            </div>
        </div>
  
    );
}

export default GenerateQuizForm;