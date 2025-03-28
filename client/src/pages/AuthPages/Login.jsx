import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/authUtils";
import AccountTypeModal from "../../components/modals/AccountTypeModal";
import loginImage from "./assets/login-image.png";
import logoImage from "./assets/logo.png";

function Login() {
    
    const { handleLogin, signInWithGoogle, userData } = useAuth();

    const [error, setError] = useState(null);

    // Log user in with AuthContext handleLogin function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await handleLogin(e.target.elements.email.value, e.target.elements.password.value);
        } catch (err) {
            // Handle different error types
            switch (err.code) {
                case 'auth/invalid-credential':
                    setError('Invalid email or password');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many attempts, try again later');
                    break;
                default:
                    setError('Login failed. Please try again');
            }
        }
    };

    
    return (
        <div className="flex">

            {/* Login image taking up left half */}
            <img className="fixed left-0 top-0 w-1/2 h-screen object-cover" src={loginImage} alt="A scrabble board with the tiles arranged to spell 'Learn'" />

            {/* Login form taking up right half */}
            <div className="ml-[50%] h-screen bg-white w-1/2 px-6 py-6">

                {/* QuizCraft heading */}
                <div className="flex gap-3 my-3">
                    <img src={logoImage} alt="logo" className="w-12 h-12 text-[#18981D] fill-curent"/>
                    <h1 className="text-4xl font-bold text-[#18981D]">QuizCraft</h1>
                </div>

                <div className="w-1/2 justify-items-start mx-auto my-5">
                    <div className="font-semibold text-3xl">
                        <h3>Login to your Account</h3>
                    </div>

                    <form className="w-full" onSubmit={handleSubmit}>
                        
                        {/* Email input */}
                        <div className="flex flex-wrap -mx-3 my-4">
                            <div className="w-full px-3 justify-items-start">
                                <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="email" 
                                    type="email"
                                    placeholder="Student@gmail.com">
                                </input>
                            </div>
                        </div>

                        
                        {/* Password input */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <div className="justify-items-start mb-1">
                                    <label className="block tracking-wide text-gray-700 text-lg font-semibold" htmlFor="password">
                                        Password
                                    </label>
                                </div>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="password" 
                                    type="password" 
                                    placeholder="***********">
                                </input>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mb-3">{error}</div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="block w-full text-xl text-white bg-[#18981D] py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:cursor-pointer"
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                Login
                            </button>
                        </div>

                        <div className="flex items-center my-2 justify-center">
                            <hr className="flex-grow border-t border-zinc-300" />
                            <p className="mx-4 text-sm text-zinc-500">Or</p>
                            <hr className="flex-grow border-t border-zinc-300" />
                        </div>

                        <button
                            onClick={signInWithGoogle}
                            className="block w-full text-xl py-2 px-4 mb-3 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:text-white hover:cursor-pointer"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}>
                            Sign in with Google Account
                        </button>

                        <div className="flex flex-col mt-10">
                            <Link to={'/reset-password'} className="hover:text-[#18981D] mb-3"><b>Forgot Password?</b></Link>
                            <Link to={'/register'} className="hover:text-[#18981D]">Don&apos;t have an account?  <u><b>Register</b></u> now</Link>
                        </div>

                    </form>       

                    {userData.showTypeModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
                            <AccountTypeModal />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;