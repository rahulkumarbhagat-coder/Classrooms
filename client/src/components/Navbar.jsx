import { Link } from "react-router-dom"

function Navbar() {
    return (
      <nav className="bg-emerald-900">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center text-3xl text-white">
                <Link to={'/'}>
                    QuizRooms
                </Link>
            </div>
  
            {/* Navigation Links */}
            <div className="flex flex-1 justify-end">
              <div className="flex space-x-4">
              <Link 
                    to={'/generate-quiz'}
                    className="w-full bg-white text-emerald-900 hover:bg-emerald-600 hover:text-white py-3 px-6 rounded-lg font-medium">
                        Generate a Quiz!
                </Link>   
              </div>
            </div>
  
          </div>
        </div>
      </nav>
    )
  }
  
  export default Navbar