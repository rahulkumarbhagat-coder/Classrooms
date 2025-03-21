import { Quiz } from "../models/Quiz.js";

const updateQuiz = async(req, res) =>{
    const {quizId, updatedQuizData} = req.body
    
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, {$set: updatedQuizData}, {new: true})
    res.json({success: true, updatedQuiz})
    } catch (error) {
        console.log("Error", error);
    }
    
}

export default updateQuiz;