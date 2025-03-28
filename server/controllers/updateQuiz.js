import { Quiz } from "../models/Quiz.js";
import { User } from "../models/User.js";

const updateQuiz = async (req, res) => {
  const { quizId, updatedQuizData, result } = req.body;
  const { uid } = req.user;
  try {
    let updatedQuiz;
    if (updatedQuizData) {
        updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: updatedQuizData },
      { new: true }
    );
    }
    
    else if (result) {
      const user = await User.findOne({ firebaseUid: uid });
      
              if(!user) {
                  return res.status(404).json({ error: 'User not found'});    
              }
        const resultEntry = {
            user: user._id,
            result: result,
            completedAt: new Date()
        }
      updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { results: resultEntry } },
        { new: true }
      );
      await User.findByIdAndUpdate(user._id,
        {$push: {quizzes: updatedQuiz}},
        {new: true}
      )
    }
    
    if (!updatedQuiz) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }

    res.json({ success: true, updatedQuiz });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json("Internal Server Error")
  }
};

export default updateQuiz;
