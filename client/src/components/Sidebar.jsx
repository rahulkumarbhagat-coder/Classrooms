import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/authUtils';
import { getAuth, signOut } from 'firebase/auth';

const Sidebar = () => {

  const { userData } = useAuth();
  const [active, setActive] = useState(1)

  const handleLogout = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.log("Error signing out", error);
    }
}
  return (
    <div>
    <aside className="w-72 bg-gray-100 p-6 flex flex-col space-y-6 min-h-screen shadow- absolute top-0 z-999 overflow-y-hidden">
        <div className="flex gap-3 mb-[36px] justify-center">
        <img src="Frame (2).svg" alt="logo" className="w-10 h-10"/>
        <h1 className="text-3xl font-bold text-gray-900">QuizCraft</h1>
        </div>
        <nav className="space-y-4">
          <Link href="/" className={`block mb-5 ${active === 1 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} p-3 rounded-lg font-medium`} onClick={()=> setActive(1)}>
          <div className="flex gap-8 justify-center">
          <img src={active === 1? "Vector (9).svg" : "ic_round-space-dashboard.svg"} alt="" /><span className='w-20'>Dashboard</span> 
          </div>
            </Link>
            {userData.isTeacher ?
            <Link href="#" className={`block mb-4 ${active === 2 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} p-3 rounded-lg font-medium`} onClick={()=> setActive(2)}>
            <div className="flex gap-8 justify-center">
            <img src={active === 2 ? "Group (2).svg" : "Group (1).svg"} alt="" /><span className='w-20'>Students</span>
            </div>
              </Link>
              :
              <Link href="#" className={`block mb-4 ${active === 2 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} p-3 rounded-lg font-medium`} onClick={()=> setActive(2)}>
          <div className="flex gap-8 justify-center">
          <img src={active === 2 ? "Vector (13).svg" : "Vector (8).svg"} alt="" /><span className='w-20'>Classes</span>
          </div>
            </Link>
            }
            
          {!userData.isTeacher && <Link to={'/display-my-quiz'} className={`block mt-4 ${active === 3 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} p-3 rounded-lg font-medium`} onClick={()=> setActive(3)}>
            <div className="flex gap-8 justify-center">
            <img src={active === 3 ? "graph-bar 1 (1).svg" : "graph-bar-black.svg"} alt="" /><span className='w-20 whitespace-nowrap'>Quiz History</span>
            </div>
            </Link>}
        </nav>
        <div className="absolute bottom-5 right-1">
          <div className="p-4 rounded-lg text-center text-white">
          <img src="Frame 33587.svg" alt="" />
        </div>
        <button className="text-red-600 font-medium">
          {userData.user?
          <div className="flex gap-5 justify-center cursor-pointer" onClick={handleLogout}>
          <img src="Frame (1).svg" alt="" />
          Log out
          </div> 
          :
          <Link to={'/login'} className="flex gap-5 justify-center cursor-pointer">
          <img src="Frame (1).svg" alt="" />
          Login
          </Link>
        }
          
          </button>
        </div>
        
      </aside>
    </div>
  )
}

export default Sidebar
