import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Homepage from './pages/HomePage.jsx';
import Register from './pages/AuthPages/Register.jsx'
import Login from './pages/AuthPages/Login.jsx'
import ResetPassword from './pages/AuthPages/ResetPassword.jsx';
import NewPassword from './pages/AuthPages/NewPassword.jsx';
import CreateClassroom from './pages/ClassroomPages/CreateClassroom.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ClassroomProvider } from './context/ClassroomContext.jsx';
import JoinClassroom from './pages/ClassroomPages/JoinClassroom.jsx';
import ClassroomDashboard from './pages/ClassroomPages/ClassroomDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import DisplayQuiz from './pages/QuizPages/DisplayQuiz.jsx';
import StudentResults from './pages/QuizPages/StudentResults.jsx';
import QuizSetting from './pages/QuizPages/QuizSetting.jsx';
import ReviewQuiz from './pages/QuizPages/ReviewQuiz.jsx';
import QuizForm from './pages/QuizPages/QuizForm.jsx';
import AllResult from './pages/QuizPages/AllResult.jsx';
import QuizHistory from './pages/QuizPages/QuizHistory.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/generate-quiz",
        element: <QuizForm />,
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/new-password',
        element: <NewPassword />
      },
      {
        path: '/create-classroom',
        element: <CreateClassroom />
      },
      {
        path: '/join-classroom',
        element: <JoinClassroom />
      },
      {
        path: '/classroom/:id',
        element: <ClassroomDashboard />
      },
      {
        path: '/student/:id',
        element: <StudentDashboard />
      },
      {
        path: '/review-quiz',
        element: <ReviewQuiz />
      },
      {
        path: '/quiz-setting',
        element: <QuizSetting />
      },
      {
        path: '/display-quiz',
        element: <DisplayQuiz />
      },
      {
        path: "/display-result",
        element: <StudentResults />,
      },
      {
        path: "/display-my-quiz",
        element: <QuizHistory />,
      },
      {
        path: "/display-all-result",
        element: <AllResult />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ClassroomProvider>
        <RouterProvider router={router} />
      </ClassroomProvider>
    </AuthProvider>
  </StrictMode>,
);
