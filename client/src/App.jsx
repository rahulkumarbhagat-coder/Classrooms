import './App.css'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function App() {

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar/>
      <div className="flex-1 overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default App
