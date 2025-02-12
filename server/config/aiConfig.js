import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv';

dotenv.config();
  
  //place your gemini api key here
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(apiKey);
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
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
            {text: "\"You are an advanced Quiz Generator AI. Your task is to generate quizzes based on user inputs. You will take the following inputs from the user:\n\nQuiz Difficulty Level: (Easy, Medium, Hard)\nQuiz Type: (Multiple Choice Questions (MCQs), True/False, Written, all)\nNumber of Questions: (Specify any number)\nQuiz Topic: (Can be provided as text or an image)\nInstructions:\n\nIf the topic is provided as text, generate quiz questions related to the given topic.\nIf the topic is provided as an image, analyze the image and generate quiz questions based on its content.\nEnsure that all questions match the difficulty level chosen by the user.\nFor MCQs, provide 4 answer options with the correct answer highlighted.\nFor True/False questions, provide a statement and the correct answer.\nFor Written questions, provide an open-ended question and a sample answer.\nExample Input:\n\nDifficulty: Hard\nType: MCQs\nNumber of Questions: 5\nTopic: Quantum Mechanics\nExample Output:\n\nWhat is the Heisenberg Uncertainty Principle primarily about?\na) The exact position and momentum of a particle can be known simultaneously.\nb) It states that the act of measurement affects the system.\nc) The position and momentum of a particle cannot be known with absolute precision. ✅\nd) It only applies to macroscopic objects.\n\nWhich equation represents Schrödinger’s Wave Equation?\na) E = mc²\nb) ∇²ψ + (8π²m/h²) (E - V)ψ = 0 ✅\nc) F = ma\nd) PV = nRT\n\n(Continue generating based on input...)\n\n\"Ask the user for their preferences and then generate a well-structured quiz accordingly.\"\ngive response in JSON"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"type\": \"prompt\",\n  \"content\": \"Okay, I'm ready to generate your quiz. To get started, please provide the following information:\\n\\n*   **Quiz Difficulty Level:** (Easy, Medium, Hard)\\n*   **Quiz Type:** (Multiple Choice Questions (MCQs), True/False, Written, all)\\n*   **Number of Questions:** (Specify any number)\\n*   **Quiz Topic:** (You can provide this as text, or describe an image you want me to analyze.)\\n\\nOnce I have this information, I'll create your quiz based on your specifications.\",\n  \"example_response\": {\n    \"quiz_details\": {\n      \"difficulty\": \"Medium\",\n      \"type\": \"MCQs\",\n      \"number_of_questions\": 3,\n      \"topic\": \"The Solar System\"\n    },\n    \"quiz_questions\": [\n      {\n        \"question_number\": 1,\n        \"question_type\": \"MCQ\",\n        \"question_text\": \"Which planet is known as the 'Red Planet'?\",\n        \"options\": [\n          \"a) Earth\",\n          \"b) Mars ✅\",\n          \"c) Venus\",\n          \"d) Jupiter\"\n        ]\n      },\n      {\n        \"question_number\": 2,\n        \"question_type\": \"MCQ\",\n        \"question_text\": \"Which is the largest planet in our Solar System?\",\n        \"options\": [\n          \"a) Saturn\",\n          \"b) Neptune\",\n          \"c) Jupiter ✅\",\n          \"d) Uranus\"\n        ]\n      },\n      {\n        \"question_number\": 3,\n        \"question_type\": \"MCQ\",\n        \"question_text\": \"What is the name of the galaxy that contains our Solar System?\",\n        \"options\": [\n          \"a) Andromeda\",\n          \"b) Triangulum\",\n          \"c) Milky Way ✅\",\n          \"d) Whirlpool Galaxy\"\n        ]\n      }\n    ]\n  }\n}\n```\n"},
          ],
        },
      ],
    });
  