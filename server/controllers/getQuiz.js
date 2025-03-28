import { Quiz } from "../models/Quiz.js"
import { User } from "../models/User.js"

const getClassroomQuiz = async(req,res) =>{
    const {id} = req.params
    
    try {
        const classroomQuiz = await Quiz.find({classroom:id})
        res.json(classroomQuiz)
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getAllQuizzes = async(req,res) => {
    try {
        const allQuizzes = await Quiz.find({})
        res.json(allQuizzes)
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getUserQuiz = async(req, res) =>{
    try {
        const {uid} = req.user
        const user = await User.findOne({ firebaseUid: uid }); 
            if(!user) {
                return res.status(404).json({ error: 'User not found'});    
            }
        const userQuiz = await Quiz.findById(user.quizzes)
        res.json(userQuiz)
        
    } catch (error) {
        res.status(500).json({message: "Server Error"})
        console.log("Error", error);
    }
}

export { getClassroomQuiz, getAllQuizzes, getUserQuiz }