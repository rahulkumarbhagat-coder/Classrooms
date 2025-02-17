import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import GenerateQuizForm from './pages/GenerateQuizForm.jsx';
import Homepage from './pages/HomePage.jsx';
import Register from './pages/Register.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: '/generate-quiz',
        element: <GenerateQuizForm />
      },
      {
        path: '/register',
        element: <Register />
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
