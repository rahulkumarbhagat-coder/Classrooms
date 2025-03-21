import { create } from "zustand";
import { persist } from "zustand/middleware";

const quizStore = create(
  persist(
    (set, get) =>({

    //state variables
    quizData : {},
    allQuizzes : [],
    quizResults: {},
    
    //setter functions
    newResults: (result) => set({quizResults: result}),
    newQuiz: (quiz) => set({quizData: quiz}),
    setAllQuiz: (quiz) => set({allQuizzes: quiz})
  }),

  //storage
  {
    name: "quiz-store", // LocalStorage key
    getStorage: () => localStorage,
  }
  )
)

export default quizStore;