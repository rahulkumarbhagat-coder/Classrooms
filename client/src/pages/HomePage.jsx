
import { Link } from "react-router-dom";
import { useAuth } from "../utils/authUtils";

function Homepage() {

    const { userData } = useAuth();
    
    return (
        <>
            <div className="my-10 text-7xl">
            <h1>Welcome to our Quiz Generator {userData.firstName} !</h1>
            </div>

            <div className="flex bg-emerald-400 rounded-2xl p-5 space-x-4 w-1/4 mx-auto">
                <Link 
                    to={'/generate-quiz'}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                    Generate a Quiz!
                </Link>                
                <Link 
                    to={'/login'}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                    Login
                </Link>   
                <Link 
                    to={'/create-classroom'}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                    Create Classroom
                </Link>     

            </div>
        </>  
        );
}

export default Homepage;