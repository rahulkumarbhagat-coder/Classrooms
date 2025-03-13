import express from 'express'
import { createQuiz } from '../controllers/createQuiz.js'
import answerCheck from '../controllers/answerCheck.js'
import multer from 'multer'

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

quizRouter.post('/check', answerCheck)