import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config"
import { Link } from "react-router-dom";

function Login() {

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword( auth, e.target.elements.email.value, e.target.elements.password.value);
            alert('Welcome back!')
        } catch(error) {
            console.error('Login error:', error);
        }
    };
    
    return (
        <div className="w-full bg-slate-300 md:w-[600px] mx-auto mt-5 px-4 py-5 rounded-xl shadow-lg md:px-0">
            <div className="my-5 text-6xl">
                <h1>Login</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Email input */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input 
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            id="email" 
                            type="email"
                            placeholder="Student@gmail.com">
                        </input>
                    </div>
                </div>

                
                {/* Password input */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input 
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            id="password" 
                            type="password" 
                            placeholder="***********">
                        </input>
                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="role">
                            Account Type
                        </label>
                        <div className="relative">
                            <select 
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                id="role">
                                    <option>Student</option>
                                    <option>Teacher</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:!bg-amber-500 hover:cursor-pointer"
                    >
                        Login
                    </button>
                </div>

                <Link to={'/register'} className="text-sm mb-4 hover:text-blue-700">Don&apos;t have an account? Register!</Link>

            </form>        
        </div>
    );
}

export default Login;