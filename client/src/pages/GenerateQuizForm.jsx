import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import quizStore from '../store/quizStore';

function GenerateQuizForm() {

    const { newQuiz } = quizStore()
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const topic = e.target.elements.quizTopic.value;
            const difficulty = e.target.elements.quizDifficulty.value;
            const type = e.target.elements.quizType.value;
            const questions = e.target.elements.questions.value;

            const userInput = {
                topic,
                difficulty,
                type,
                questions
            }

            const response = await fetch('https://quiz-generator-k60h.onrender.com/quiz/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput })
            });
            const quiz = await response.json()
            newQuiz(JSON.parse(quiz))
            navigate('/display-quiz')
            

            if(!response.ok) {
                throw new Error('Failed to create test')
            }
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
                    Create your Quiz!
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
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
                            name="quizTopic"
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
                            id="quiz-difficulty"
                            name="quizDifficulty">
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
                            id="quiz-type"
                            name="quizType">
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true-false">True/False</option>
                                <option value="written">Written</option>
                                <option value="mixture">Mixture</option>
                        </select>
                    </div>

                    {/* Number of Questions */}
                    <div className="space-y-2">
                        <label 
                            className="block text-left text-sm px-1 font-bold text-gray-700"
                            htmlFor="questions">
                                Number of Questions
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            className="w-full px-4 py-2 rounded-lg border focus:ring-emerald-500"
                            placeholder="Enter number of questions"
                            id="questions"
                            name="questions"
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