import { create } from "zustand";
import { persist } from "zustand/middleware";

const quizStore = create(
  persist(
    (set, get) =>({

    quizData : {},
    quizResults: {},
    
    newResults: (result) => set({quizResults: result}),
    newQuiz : (quiz) => set({quizData: quiz})
  }),
  {
    name: "quiz-store", // LocalStorage key
    getStorage: () => localStorage,
  }
  )
)

export default quizStore;