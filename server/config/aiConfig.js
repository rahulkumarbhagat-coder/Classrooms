import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv';
import fs from 'fs'

dotenv.config();
  
  //place your gemini api key here
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(apiKey);
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  export const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  //for image input
  export function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }
  

  //for text input
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "\"You are an advanced Quiz Generator AI. Your task is to generate quizzes based on user inputs. You will take the following inputs from the user:\n\nQuiz Difficulty Level: (Easy, Medium, Hard)\nQuiz Type: (Multiple Choice Questions (MCQs), True/False, Short, Essay)\nNumber of Questions: (Specify any number)\nQuiz Topic: (Can be provided as text or an image)\nInstructions:\n\nIf the topic is provided as text, generate quiz questions related to the given topic.\nIf the topic is provided as an image, analyze the image and generate quiz questions based on its content.\nEnsure that all questions match the difficulty level chosen by the user.\nFor MCQs, provide 4 answer options with the correct answer highlighted.\nFor True/False questions, provide a statement and the correct answer.\nFor Short questions, provide an open-ended question which require 2-4 line answer, and a sample answer.\nFor Short questions, provide an open-ended question which require more than 5 line answer, and a sample answer.\nExample Input:\n\nDifficulty: Hard\nType: MCQs\nNumber of Questions: 5\nTopic: Quantum Mechanics\nExample Output:\n\nWhat is the Heisenberg Uncertainty Principle primarily about?\na) The exact position and momentum of a particle can be known simultaneously.\nb) It states that the act of measurement affects the system.\nc) The position and momentum of a particle cannot be known with absolute precision.\nd) It only applies to macroscopic objects.\n\nanswer: c) The position and momentum of a particle cannot be known with absolute precision.\n\nWhich equation represents Schrödinger’s Wave Equation?\na) E = mc²\nb) ∇²ψ + (8π²m/h²) (E - V)ψ = 0\nc) F = ma\nd) PV = nRT\n\nanswer: b) ∇²ψ + (8π²m/h²) (E - V)ψ = 0\n\n(Continue generating based on input...)\n\nit should be in like this:\n\n{\n  \"quiz_details\": {\n    \"difficulty\": \"Easy\",\n    \"type\": \"Mixture\",\n    \"number_of_questions\": 4,\n    \"topic\": \"Anime\"\n  },\n  \"quiz_questions\": [\n    {\n      \"question_number\": 1,\n      \"question_type\": \"MCQ\",\n      \"answer\": c) Studio Ghibli,\n      \"question_text\": \"What studio is known for producing Studio Ghibli films?\",\n      \"options\": [\n        \"a) Toei Animation\",\n        \"b) Sunrise\",\n        \"c) Studio Ghibli \",\n        \"d) Madhouse\"\n      ]\n    },\n    {\n      \"question_number\": 2,\n      \"question_type\": \"True/False\",\n      \"question_text\": \"Anime is exclusively a Japanese art style. \",\n      \"answer\": \"True ✅\"\n    },\n    {\n      \"question_number\": 3,\n      \"question_type\": \"Short Answer\",\n      \"question_text\": \"Name one popular anime character and briefly describe what makes them special.\",\n      \"sample_answer\": \"Example: Naruto Uzumaki from 'Naruto.' He is special because of his determination to achieve his dream of becoming Hokage, despite facing many challenges.\"\n    },\n    {\n      \"question_number\": 4,\n      \"question_type\": \"MCQ\",\n      \"answer\": c) Cubism,\n      \"question_text\": \"Which of the following is a popular genre in anime?\",\n      \"options\": [\n        \"a) Mecha \",\n        \"b) Impressionism\",\n        \"c) Cubism\",\n        \"d) Baroque\"\n      ]\n    }\n  ]\n}\n\n\"Ask the user for their preferences and then generate a well-structured quiz accordingly.\"\ngive response in JSON"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I'm ready to generate quizzes. First, I need your preferences. Please provide the following information:\n\n*   **Quiz Difficulty Level:** (Easy, Medium, Hard)\n*   **Quiz Type:** (MCQs, True/False, Written, Mixture)\n*   **Number of Questions:** (Specify a number)\n*   **Quiz Topic:** (Provide the topic as text, e.g., \"World History\", \"Photosynthesis\", \"Introduction to Programming\")\n\nOnce you provide this information, I will generate a quiz in JSON format, following the structure you outlined. I'll do my best to create questions that match your specified difficulty level and topic.\n"},
          ],
        },
      ],
    });
  