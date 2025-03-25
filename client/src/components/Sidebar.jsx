import { Link } from 'react-router-dom'
import { useAuth } from '../utils/authUtils';

const Sidebar = () => {

  const { userData, handleLogout } = useAuth();

  return (
    <div>
      <aside className="w-72 bg-gray-100 p-6 flex flex-col space-y-6 min-h-screen shadow- absolute top-0 z-999 overflow-y-hidden">
        <div className="flex gap-3 mb-[50px] justify-center">
        <img src="Frame (2).svg" alt="logo" className="w-10 h-10"/>
        <h1 className="text-3xl font-bold text-gray-900">QuizCraft</h1>
        </div>
        <nav className="space-y-4">
          <Link to={'/'} className="block mb-8 text-gray-700 font-medium hover:text-black">
            <div className="flex gap-8 justify-center">
              <img src="ic_round-space-dashboard.svg" alt="" /> Dashboard
            </div>
          </Link>
          <Link href="#" className="block mb-8 text-gray-700 font-medium hover:text-black">
            <div className="flex gap-8 justify-center">
              <img src="graph-bar 1.svg" alt="" /> Achievement
            </div>
          </Link>
          <Link href="#" className="block mt-8 text-white bg-black p-3 rounded-lg">
            <div className="flex gap-8 justify-center">
              <img src="graph-bar 1 (1).svg" alt="" /> Quiz History
            </div>
          </Link>
        </nav>
        <div className="p-4 rounded-lg text-center text-white">
          <img src="Group 83.png" alt="" />
        </div>
        <button className="font-medium">
          {userData.user?
          <div className="flex text-red-600 gap-5 justify-center hover:cursor-pointer" onClick={handleLogout}>
            <img src="Frame (1).svg" alt="" />
            Log out
          </div> 
          :
          <Link to={'/login'} className="flex gap-5 justify-center">
            <img src="Frame (1).svg" alt="" />
            Login
          </Link>
        }
          
        </button>
      </aside>
    </div>
  )
}

export default Sidebar
