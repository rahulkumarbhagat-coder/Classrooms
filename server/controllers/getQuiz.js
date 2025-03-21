import { Classroom } from "../models/Classroom.js"
import { Quiz } from "../models/Quiz.js"

const getClassroomQuiz = async(req,res) =>{
    const {classroomId} = req.body
    const classroomQuiz = await Quiz.find({classroom:classroomId})
    res.json(classroomQuiz)
}

const getAllQuizzes = async(req,res) => {
    const allQuizzes = await Quiz.find({})
    res.json(allQuizzes)
}

export { getClassroomQuiz, getAllQuizzes }