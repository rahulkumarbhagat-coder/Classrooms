import React, { useRef, useState } from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import quizStore from '../../store/quizStore'
import QuizLoader from '../../components/QuizLoader';

const QuizForm = () => {

  const { newQuiz } = quizStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [load, setLoad] = useState()
    const [image, setImage] = useState(false)
    const [classrooms, setClassrooms] = useState([])
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const abortControllerRef = useRef(null)

    const [quizData, setQuizData] = useState({
        title: "",
        class: "",
        description: "",
        topic: "",
        detailedTopic: "",
        difficulty: "Medium",
        questionTypes: ["Multiple Choice"],
        numQuestions: 5,
        timeLimit: 2,
        pointsPerQuestion: 1,
      });

      const handleSubmit = async(e) => {
        e.preventDefault();

        try {
          console.log(quizData);
            const title = quizData.title
            const description = quizData.description
            const topic = `${quizData.topic}, ${quizData.detailedTopic}`;
            const difficulty = quizData.difficulty;
            const type = quizData.questionTypes;
            const questions = quizData.numQuestions;
            const classroom = quizData.class;

            setLoading(true)
            abortControllerRef.current = new AbortController()
            const { signal } = abortControllerRef.current
           

            const userInput = new FormData()
            userInput.append("image", image)
            userInput.append("topic", topic)
            userInput.append("title", title)
            userInput.append("descrption", description)
            userInput.append("difficulty", difficulty)
            userInput.append("type", type)
            userInput.append("noOfQuestions", questions)
            userInput.append("classroom", classroom)


            let progress = 10
            const loadingInterval = setInterval(()=>{
                progress+=1
                if (progress>=90) {
                    clearInterval(loadingInterval)
                }
                setLoad(progress)
            },100)

            const response = await fetch(`${BASE_URL}/quiz/create`, {
                method: 'POST',
                body: userInput,
                signal
            });
            
            if (!response.ok) {
                throw new Error('Failed to create test');
            }

            const quiz = await response.json()
            console.log(quiz);
            newQuiz(quiz)

            clearInterval(loadingInterval)
            setLoad(100)

            if (quiz) {
                setTimeout(()=>{
                setLoading(false)
                setImage(false)
                navigate(`/review-quiz`)
                }, 500)
                
            }

        } catch (error) {
            console.error('Error creating the quiz:', error)
        }
    }

    const cancelQuizGeneration = () =>{
      if (abortControllerRef.current) {
          abortControllerRef.current.abort()
      }
      setLoading(false)
      setLoad(0)
  }
    
      const handleChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
      };
    
      const toggleQuestionType = (type) => {
        setQuizData((prev) => ({
          ...prev,
          questionTypes: prev.questionTypes.includes(type)
            ? prev.questionTypes.filter((t) => t !== type)
            : [...prev.questionTypes, type],
        }));
      };

  return (
    <div className="w-full max-h-[100vh] flex flex-col items-end">
      <div className="w-full md:w-[77%]">
        <div className="p-6 flex flex-col gap-6">
            {/* Header */}
            <Header/>
            {loading ? <QuizLoader load={load} cancelQuizGeneration={cancelQuizGeneration}/>
        : (
          <>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className="w-full mx-auto p-6 bg-white text-left shadow-lg rounded-2xl">
            
            {/* 📌 Basic Information */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Basic Information</h2>
            <p className="text-gray-500 text-sm mb-1">
              Enter the basic details for your quiz
            </p>
            <hr className='text-gray-400 pb-5'/>
    
            <label className="block font-semibold text-lg">Quiz Title</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              className="w-full p-3 border-gray-200 border-2 bg-white rounded-2xl shadow-xl mt-1 font-semibold text-sm md:text-lg"
            />
    
            <label className="block font-semibold text-lg mt-4">Class</label>
            <select
              name="class"
              value={quizData.class}
              onChange={handleChange}
              className="w-56 border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 mt-1 font-semibold text-gray-600"
            >
              <option value="" className='border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold'>Select class</option>
              {classrooms?.map((classroom, index) =>(
                <option value="Class 10" className='border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold'>{classroom.name}</option>
              ))}
            </select>
    
            <label className="block font-semibold text-lg mt-4">Quiz Description</label>
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of what this quiz covers"
              className="w-full min-h-40 border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold mt-1"
            ></textarea>
            <p className="text-gray-500 text-sm mt-1">
              This will be visible to students before they start the quiz.
            </p>
          </div>
            </div>
            
        <div className="w-full mx-auto p-6 bg-white text-left shadow-lg rounded-2xl">
    
          {/* 📌 Quiz Topic & Content */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Quiz Topic & Content</h2>
            <p className="text-gray-500 text-sm mb-1">
              Provide the topic and content for AI to generate questions from
            </p>
            <hr className='text-gray-400 pb-5'/>
    
            <label className="block font-semibold text-lg">Image Content</label>
            <label className='w-32' htmlFor="image">{<img src={image ? URL.createObjectURL(image) : 'upload_area.png'} alt="" className='w-32'/>}</label>
            <input className='w-32' id='image' type="file" hidden onChange={(e)=> setImage(e.target.files[0])}/>
    
            <label className="block font-semibold text-lg mt-4">Quiz Topic</label>
            <input
              type="text"
              name="topic"
              value={quizData.topic}
              onChange={handleChange}
              placeholder="E.g., Algebra, Biology..."
              className="w-full border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold text-sm md:text-lg mt-1"
            />
    
            <label className="block font-semibold text-lg mt-4">
              Detailed Topic Description (Optional)
            </label>
            <textarea
              name="detailedTopic"
              value={quizData.detailedTopic}
              onChange={handleChange}
              placeholder="Provide additional details about the topic..."
              className="w-full min-h-40 border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold mt-1"
            ></textarea>
    
            <p className="text-gray-500 text-sm mt-1">
              The more specific and detailed your content, the more accurate and
              relevant your generated questions will be.
            </p>
          </div>
        </div>
    
        <div className="w-full mx-auto p-6 bg-white text-left shadow-lg rounded-2xl">
            {/* 📌 Quiz Parameters */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Quiz Parameters</h2>
            <p className="text-gray-500 text-sm mb-1">
              Configure the structure and difficulty of your quiz
            </p>
            <hr className='text-gray-400 pb-5'/>
    
            {/* Difficulty Level */}
            <label className="block font-semibold text-lg mb-2">Difficulty Level</label>
            <div className="flex flex-col md:flex-row gap-5 mb-8">
              {["Easy", "Medium", "Hard"].map((level) => (
                <div
                  key={level}
                  className={`flex flex-col gap-5 items-center w-full bg-white border-2 rounded-xl shadow-xl p-3 font-semibold mt-1 ${
                    quizData.difficulty === level
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => setQuizData({ ...quizData, difficulty: level })}
                >
                    {level === "Easy" ?
                    <div className="flex gap-3 pt-4">
                        <img src="Vector (2).svg" alt="" />
                        <img src="Vector (3).svg" alt="" />
                        <img src="Vector (3).svg" alt="" />
                    </div>
                    :
                    level === "Medium" ? 
                    <div className="flex gap-3 pt-4">
                        <img src="Vector (2).svg" alt="" />
                        <img src="Vector (2).svg" alt="" />
                        <img src="Vector (3).svg" alt="" />
                    </div>
                    :
                    <div className="flex gap-3 pt-4">
                        <img src="Vector (2).svg" alt="" />
                        <img src="Vector (2).svg" alt="" />
                        <img src="Vector (2).svg" alt="" />
                    </div>
                    }
                  <div className="text-center">
                    {level}
                  <p className='text-sm text-gray-600 font-normal'>{level === "Easy"? 'Basic recall and simple concepts' : level === "Medium" ? 'Application of concepts' : 'Analysis and evaluation'}</p>
                  </div>
                  
                </div>
              ))}
            </div>
    
            {/* Question Types */}
            <label className="block font-semibold text-lg mt-4 mb-2">Question Types</label>
            <div className="flex flex-col md:flex-row gap-3 mb-8">
              {["Multiple Choice", "True/False", "Short Answer", "Essay"].map((type) => (
                <div
                  key={type}
                  className={`flex flex-col gap-3 w-full bg-white text-center border-2 shadow-xl p-3 mt-1 items-center font-semibold rounded-lg ${
                    quizData.questionTypes.includes(type)
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleQuestionType(type)}
                >
                  <div className="pt-3">
                    {type === 'Multiple Choice'?
                  <img src="vaadin_options.svg" alt="" />
                  :
                  type === 'True/False' ?
                  <div className='flex gap-2'>
                  <img src="Group.svg" alt="" />
                  <img src="Vector (5).svg" alt="" />
                  </div>
                  :
                  type === 'Short Answer' ?
                  <img src="carbon_question-answering.svg" alt="" />
                  :
                  <img src="Vector (12).svg" alt="essay" />
                }
                  </div>
                  <div>
                    {type}
                    <p className='text-sm font-normal text-gray-600'>{type === "Multiple Choice" ? 'Questions with options' : type === "True/False" ? 'Binary choice questions' : type === "Short Answer" ? 'Brief written response' : 'Mix of every type'}</p>
                  </div>
                  
                </div>
              ))}
            </div>
    
            {/* Number of Questions */}
            <label className="block font-semibold text-lg mt-4">Number of Questions</label>
            <input
              type="number"
              name="numQuestions"
              value={quizData.numQuestions}
              onChange={handleChange}
              className="w-full border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold mt-1"
            />
            <p className="text-gray-500 text-sm mt-1 mb-3">
              Enter the total number of questions.
            </p>
    
            <div className="w-full flex gap-5">
                <div className='w-full'>
                    {/* Time Limit */}
            <label className="block font-semibold text-lg mt-4">Time Limit (Minutes)</label>
            <input
              type="number"
              name="timeLimit"
              value={quizData.timeLimit}
              onChange={handleChange}
              className="w-full border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold mt-1"
            />
            <p className="text-gray-500 text-sm mt-1">
              Leave blank for unlimited time.
            </p>
                </div>
                <div className='w-full'>
                    {/* Points per Question */}
            <label className="block font-semibold text-lg mt-4">Points per Question</label>
            <input
              type="number"
              name="pointsPerQuestion"
              value={quizData.pointsPerQuestion}
              onChange={handleChange}
              className="w-full border-gray-200 border-2 bg-white rounded-2xl shadow-xl p-3 font-semibold mt-1"
            />
                </div>
            </div>
          </div>
        </div>
    
        {/* 📌 Generate Quiz Button */}
        <button type='submit' className="w-52 self-center bg-black text-white py-3 rounded-lg shadow-lg text-lg font-semibold">
            Generate Quiz
          </button>
          </form>
            
          </>
        )
        }
        
            </div>
        </div>
    </div>
    
  );
}

export default QuizForm
