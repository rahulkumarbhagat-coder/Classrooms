import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const answerCheck = async(req, res) =>{
const {userAnswer, totalMarks} = req.body


const apiKey = process.env.GEMINI_API_KEY  
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

const prompt = `Here is question and user's answer ${JSON.stringify(userAnswer)}, Tell if isCorrect and Score it out of ${JSON.stringify(totalMarks)}. Give response in JSON format`;
console.log(prompt);
  try {
  const result = await model.generateContent(prompt);
  const resultText = await result.response.text()
  const clearJson = resultText.replace(/```json|```/g, "").trim()
  console.log(clearJson);
  const parsedResult = await JSON.parse(clearJson)
  res.json(parsedResult)
  } catch (error) {
    console.log(error);
  }
}

export default answerCheck;