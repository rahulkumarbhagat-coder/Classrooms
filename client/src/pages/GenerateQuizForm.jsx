import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import quizStore from '../store/quizStore';
import QuizLoader from '../components/QuizLoader';

function GenerateQuizForm() {

    const { newQuiz } = quizStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [load, setLoad] = useState()
    const [image, setImage] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const topic = e.target.elements.quizTopic.value;
            const difficulty = e.target.elements.quizDifficulty.value;
            const type = e.target.elements.quizType.value;
            const questions = e.target.elements.questions.value;

            setLoading(true)
           

            const userInput = new FormData()
            userInput.append("image", image)
            userInput.append("topic", topic)
            userInput.append("difficulty", difficulty)
            userInput.append("type", type)
            userInput.append("noOfQuestions", questions)


            let progress = 10
            const loadingInterval = setInterval(()=>{
                progress+=1
                if (progress>=90) {
                    clearInterval(loadingInterval)
                }
                setLoad(progress)
            },100)

            const response = await fetch('http://localhost:4000/quiz/create', {
                method: 'POST',
                body: userInput
            });

            const quiz = await response.json()
            console.log(quiz);
            newQuiz(JSON.parse(quiz))

            clearInterval(loadingInterval)
            setLoad(100)

            if (quiz) {
                setTimeout(()=>{
                setLoading(false)
                setImage(false)
                navigate('/display-quiz')
                }, 500)
                
            }
            
            

            if(!response.ok) {
                throw new Error('Failed to create test')
            }
        } catch (error) {
            console.error('Error creating the quiz:', error)
        }
    }
    
    return (
        <div className='bg-gray-200 min-h-screen'>
        {loading? <QuizLoader load={load}/> 
        : <div className="w-full md:w-[600px] mx-auto px-4 md:px-0">
            <div className="rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-emerald-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                    Create your Quiz!
                    </h2>
                </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Quiz Image */}
                <div className="space-y-2">
                    <label 
                        className="block text-left text-sm px-1 font-bold text-gray-700"
                        htmlFor="quiz-image">
                        <img src={image? URL.createObjectURL(image): 'upload_area.png'} alt="" className='w-36'/>
                    </label>
                    <input
                        type="file"
                        className=""
                        placeholder="Select Image"
                        id="quiz-image"
                        name="quizImage"
                        hidden
                        onChange={(e)=>setImage(e.target.files[0])}
                    />
                </div>
                
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
        </div>}
  
    </div>
    );
}

export default GenerateQuizForm;