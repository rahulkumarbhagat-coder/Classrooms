import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/authUtils';

const Sidebar = () => {

  const { userData } = useAuth();
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(1)

  return (
    <div className='mr-1'>
      <div className="cursor-pointer absolute z-95 mt-5 mx-5">
        <div className="flex gap-3 md:gap-5 mb-[36px] justify-center items-center">
        <img src="bars-solid.svg" alt="hamburger" className='w-5 md:hidden' onClick={()=> setShow(prev => !prev)}/>
        <img src="Frame (2).svg" alt="logo" className={`w-8 h-8 lg:w-10 lg:h-10 ${show? 'block' : 'hidden'} md:block`}/>
        <h1 className={`sm:text-xl xl:text-3xl font-bold text-gray-900 ${show? 'block' : 'hidden'} md:block`}>QuizCraft</h1>
        </div>
      </div>
    <aside className={`w-50 md:w-50 lg:w-60 xl:w-72 bg-gray-100 p-6 flex flex-col space-y-6 min-h-screen shadow- absolute top-0 z-90 overflow-y-hidden md:block ${show ? 'block' : 'hidden'}`}>
        
        <nav className="space-y-4 mt-15">
          <Link href="/" className={`block mb-5 ${active === 1 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} p-2 md:p-3 rounded-lg font-medium`} onClick={()=> setActive(1)}>
          <div className="flex gap-5 md:gap-6 justify-center">
          <img src={active === 1? "Vector (9).svg" : "ic_round-space-dashboard.svg"} alt="" className='w-4 md:w-6'/><span className='w-20 text-sm lg:text-lg'>Dashboard</span> 
          </div>
            </Link>
            {userData.isTeacher ?
            <Link href="#" className={`block mb-4 ${active === 2 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} rounded-lg font-medium p-2 md:p-3`} onClick={()=> setActive(2)}>
            <div className="flex gap-5 md:gap-6 justify-center">
            <img src={active === 2 ? "Group (2).svg" : "Group (1).svg"} alt="" className='w-4 md:w-5'/><span className='w-20 text-sm lg:text-lg'>Students</span>
            </div>
              </Link>
              :
              <Link href="#" className={`block mb-4 ${active === 2 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} rounded-lg font-medium p-2 md:p-3`} onClick={()=> setActive(2)}>
          <div className="flex gap-5 md:gap-6 justify-center">
          <img src={active === 2 ? "Vector (13).svg" : "Vector (8).svg"} alt="" className='w-4 md:w-5'/><span className='w-20 text-sm lg:text-lg'>Classes</span>
          </div>
            </Link>
            }
            
          {!userData.isTeacher && <Link to={'/display-my-quiz'} className={`block mt-4 ${active === 3 ? 'text-white bg-black' : 'text-gray-700 hover:text-black'} rounded-lg font-medium p-2 md:p-3`} onClick={()=> setActive(3)}>
            <div className="flex gap-5 md:gap-6 justify-center items-center">
            <img src={active === 3 ? "graph-bar 1 (1).svg" : "graph-bar-black.svg"} alt="" className='w-6 md:w-8'/><span className='w-20 whitespace-nowrap text-sm lg:text-lg'>Quiz History</span>
            </div>
            </Link>}
        </nav>
        <div className="absolute bottom-5 right-1">
          <div className="p-4 rounded-lg text-center text-white">
          <img src="Frame 33587.svg" alt="" className='w-50 md:w-60'/>
        </div>
        <button className="text-red-600 font-medium ">
          {userData.user?
          <div className="flex gap-5 justify-center cursor-pointer" onClick={handleLogout}>
          <img src="Frame (1).svg" alt="" />
          <p className='text-sm md:text-lg'>Log out</p>
          </div> 
          :
          <Link to={'/login'} className="flex gap-5 justify-center cursor-pointer">
          <img src="Frame (1).svg" alt="" />
          <p className='text-sm md:text-lg'>Login</p>
          </Link>
        }
          
          </button>
        </div>
        
      </aside>
    </div>
  )
}

export default Sidebar
