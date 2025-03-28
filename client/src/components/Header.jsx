import React from 'react'
import { useAuth } from "../utils/authUtils";

const Header = () => {
    const { userData } = useAuth();

  return (
    <div className='flex flex-col-reverse md:flex-row justify-between'>
      {/* Header */}
      <div className="flex justify-between items-center mt-4 md:mt-0 p-1 self-end md:self-start">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-left  mt-2 md:mt-0">
                Welcome to QuizCraft {userData.firstName}!
              </h1>
              <p className="text-gray-500 text-left whitespace-nowrap">
                Today is {new Date().toDateString()}
              </p>
            </div>
          </div>

      {/* Profile and Breadcrumbs */}
      <div className="flex gap-5 w-[70vw] h-20 md:h-full md:w-[30vw] lg:w-[20vw] self-end justify-end items-center">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-2xl">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center"><img src="Frame (3).svg" alt="" /></div>
            <div className="ml-3 text-left">
              <p className="font-bold">{userData.user ? (<>{userData.firstName} {userData.lastName}</>) : ("Guest")}</p>
              <p className="text-sm text-gray-500">{userData.isTeacher ? ("Teacher") : ("Student")}</p>
            </div>
            <img src="weui_arrow-filled.svg" alt="" className="self-end"/>
          </div>
          <div className="rounded-full shadow-2xl w-10 h-10 bg-white self-start flex justify-center items-center"><img src="Frame (4).svg" alt="" /></div>
        </div>
    </div>
  )
}

export default Header
