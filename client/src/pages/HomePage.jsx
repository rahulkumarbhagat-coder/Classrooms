
import { Link } from "react-router-dom";
import { useAuth } from "../utils/authUtils";
import { getAuth, signOut } from "firebase/auth";

function Homepage() {

    const { userData } = useAuth();

    console.log('userData', userData);

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

                {/* Login/Logout button   */}
                { userData.user ? (
                    <button
                        onClick={handleLogout}
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                        Logout
                    </button>
                    ) : (
                    <Link 
                        to={'/login'}
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                        Login
                    </Link>
                    )}       

                {/* Create/Join Classroom button   */}
                { userData.isTeacher ? (
                    <Link 
                        to={'/create-classroom'}
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                        Create Classroom
                    </Link>
                    ) : (
                    <Link 
                        to={'/join-classroom'}
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                        Join Classroom
                    </Link>
                    )}       

            </div>
        </>  
    );
}

export default Homepage;