import express from 'express'
import { createQuiz } from '../controllers/createQuiz.js'
import answerCheck from '../controllers/answerCheck.js'
import multer from 'multer'
import { getClassroomQuiz, getAllQuizzes, getUserQuiz } from '../controllers/getQuiz.js'
import updateQuiz from '../controllers/updateQuiz.js'
import deleteQuiz from '../controllers/deleteQuiz.js'
import { authMiddleware } from '../middleware/auth.js'

export const quizRouter = express.Router()

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

//create-quiz route
quizRouter.post('/create', upload.single('image'), createQuiz)

//answer checking route
quizRouter.post('/check', answerCheck)

//get quizzes route
quizRouter.get('/get-class-quiz/:id', getClassroomQuiz)
quizRouter.get('/get-all-quiz', getAllQuizzes)
quizRouter.get('/get-user-quiz', authMiddleware, getUserQuiz)


//update quize route
quizRouter.post('/update-quiz', authMiddleware, updateQuiz)

//delete quiz route
quizRouter.delete('/delete-quiz', deleteQuiz)