import './App.css';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  const location = useLocation();
  
  // List of auth routes that should not show the sidebar
  const authRoutes = ['/login', '/register', '/reset-password', '/new-password'];
  
  // Check if current path is in the authRoutes list
  const isAuthPage = authRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="flex min-h-screen overflow-hidden">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1 overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default App
