import { chatSession } from "../config/aiConfig.js";

export const createQuiz = async(req, res) => {
    const { userInput } = req.body
    const result = await chatSession.sendMessage(JSON.stringify(userInput));
    res.json(result.response.text())
}