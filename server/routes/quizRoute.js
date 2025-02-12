import express from 'express'
import { createQuiz } from '../controllers/createQuiz.js'

export const quizRouter = express.Router()

//create-quiz route
quizRouter.post('/create', createQuiz)