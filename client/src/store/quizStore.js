import { create } from "zustand";
import { persist } from "zustand/middleware";

const quizStore = create(
  persist(
    (set, get) =>({

    //state variables
    quizData : {},
    allQuizzes : [],
    classQuizzes: [],
    quizResults: {},
    
    //setter functions
    newResults: (result) => set({quizResults: result}),
    newQuiz: (quiz) => set({quizData: quiz}),
    updateQuiz: (result) => set((state) => ({
      quizData: {
        ...state.quizData,
        result
      }
    })),
    setAllQuiz: (quiz) => set({allQuizzes: quiz}),
    setClassQuiz: (quiz) => set({classQuizzes: quiz})
  }),

  //storage
  {
    name: "quiz-store", // LocalStorage key
    getStorage: () => localStorage,
  }
  )
)

export default quizStore;