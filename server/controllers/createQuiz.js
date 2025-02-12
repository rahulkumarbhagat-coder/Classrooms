import { chatSession } from "../config/aiConfig.js";

export const createQuiz = async(req, res) => {
    const { userInput } = req.body

    const result = await chatSession.sendMessage(JSON.stringify(userInput));
    console.log(result.response.text());
}