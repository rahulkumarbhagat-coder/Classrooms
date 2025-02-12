
import { Link } from "react-router-dom";

function Homepage() {
    return (
        <>
            <div className="my-10 text-7xl">
                <h1>Welcome to our Quiz Generator!</h1>
            </div>

            <div>
                <Link 
                    to={'/generate-quiz'}
                    className="w-full !bg-emerald-600 text-white hover:!bg-emerald-700 py-3 px-6 rounded-lg font-medium">
                        Generate a Quiz!
                </Link>                
            </div>
        </>  
    );
}

export default Homepage;