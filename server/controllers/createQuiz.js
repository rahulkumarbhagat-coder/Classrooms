import {
    chatSession,
    fileToGenerativePart,
    model,
  } from "../config/aiConfig.js";
  
  export const createQuiz = async (req, res) => {
    const userInput = {
      topic: req.body.topic,
      noOfQuestion: req.body.noOfQuestions,
      type: req.body.type,
      difficulty: req.body.difficulty,
    };
    console.log(userInput);
  
    try {
      if (req.file) {
        const filename = req.file.path;
        const mimeType = req.file.mimetype;
        const prompt = `You are an advanced Quiz Generator AI. Your task is to generate quizzes based on user inputs. You will take the following inputs from the user:\n\nQuiz Difficulty Level: (Easy, Medium, Hard)\nQuiz Type: (Multiple Choice Questions (MCQs), True/False, Written, all)\nNumber of Questions: (Specify any number)\nQuiz Topic: (Can be provided as text or an image)\nInstructions:\n\nIf the topic is provided as text, generate quiz questions related to the given topic.\nIf the topic is provided as an image, analyze the image and generate quiz questions based on its content.\nEnsure that all questions match the difficulty level chosen by the user.\nFor MCQs, provide 4 answer options with the correct answer highlighted.\nFor True/False questions, provide a statement and the correct answer.\nFor Written questions, provide an open-ended question and a sample answer.\nExample Input:\n\nDifficulty: Hard\nType: MCQs\nNumber of Questions: 5\nTopic: Quantum Mechanics\nExample Output:\n\nWhat is the Heisenberg Uncertainty Principle primarily about?\na) The exact position and momentum of a particle can be known simultaneously.\nb) It states that the act of measurement affects the system.\nc) The position and momentum of a particle cannot be known with absolute precision.\nd) It only applies to macroscopic objects.\n\nanswer: c) The position and momentum of a particle cannot be known with absolute precision.\n\nWhich equation represents Schrödinger’s Wave Equation?\na) E = mc²\nb) ∇²ψ + (8π²m/h²) (E - V)ψ = 0\nc) F = ma\nd) PV = nRT\n\nanswer: b) ∇²ψ + (8π²m/h²) (E - V)ψ = 0\n\n(Continue generating based on input...)\n\nit should be in like this:\n\n{\n  \"quiz_details\": {\n    \"difficulty\": \"Easy\",\n    \"type\": \"Mixture\",\n    \"number_of_questions\": 4,\n    \"topic\": \"Anime\"\n  },\n  \"quiz_questions\": [\n    {\n      \"question_number\": 1,\n      \"question_type\": \"MCQ\",\n      \"answer\": c) Studio Ghibli,\n      \"question_text\": \"What studio is known for producing Studio Ghibli films?\",\n      \"options\": [\n        \"a) Toei Animation\",\n        \"b) Sunrise\",\n        \"c) Studio Ghibli \",\n        \"d) Madhouse\"\n      ]\n    },\n    {\n      \"question_number\": 2,\n      \"question_type\": \"True/False\",\n      \"question_text\": \"Anime is exclusively a Japanese art style. \",\n      \"answer\": \"True ✅\"\n    },\n    {\n      \"question_number\": 3,\n      \"question_type\": \"Written\",\n      \"question_text\": \"Name one popular anime character and briefly describe what makes them special.\",\n      \"sample_answer\": \"Example: Naruto Uzumaki from 'Naruto.' He is special because of his determination to achieve his dream of becoming Hokage, despite facing many challenges.\"\n    },\n    {\n      \"question_number\": 4,\n      \"question_type\": \"MCQ\",\n      \"answer\": c) Cubism,\n      \"question_text\": \"Which of the following is a popular genre in anime?\",\n      \"options\": [\n        \"a) Mecha \",\n        \"b) Impressionism\",\n        \"c) Cubism\",\n        \"d) Baroque\"\n      ]\n    }\n  ]\n}\n\n\"Ask the user for their preferences and then generate a well-structured quiz accordingly.\"\ngive response in JSON. ${JSON.stringify(userInput)}`;
        const imagePart = fileToGenerativePart(filename, mimeType);
        const result = await model.generateContent([prompt, imagePart]);
        const data = result.response.text();
        const cleanedData = data.replace(/```json\s*|\s*```/g, "").trim();
        res.json(cleanedData);
        console.log(result.response.text());
      } else {
        const result = await chatSession.sendMessage(JSON.stringify(userInput));
        res.json(result.response.text());
      }
    } catch (error) {
      console.log("Error", error);
      res.status(500).json("Failed to generate quiz");
    }
  };
  