import { Quiz } from "../models/Quiz.js"

const deleteQuiz = async(req, res) =>{
    await Quiz.findByIdAndDelete(req.body.id)
    res.json({success:true, message:"Quiz Deleted Successfully"})
}

export default deleteQuiz