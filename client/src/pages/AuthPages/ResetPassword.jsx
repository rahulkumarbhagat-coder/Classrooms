import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import loginImage from "./assets/login-image.png";
import logoImage from "./assets/logo.png";

function ResetPassword() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
    
        const auth = getAuth();
        
        try {
          await sendPasswordResetEmail(auth, email);
          setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
          setError(`Error: ${error.message}`);
        }
      };

    
    return (
        <div className="flex">

            {/* Login image taking up left half */}
            <img className="fixed left-0 top-0 w-1/2 h-screen object-cover" src={loginImage} alt="A scrabble board with the tiles arranged to spell 'Learn'" />

            {/* Login form taking up right half */}
            <div className="ml-[50%] w-1/2 px-6 py-6">

                {/* QuizCraft heading */}
                <div className="flex gap-3 my-3">
                    <img src={logoImage} alt="logo" className="w-12 h-12 text-[#18981D] fill-curent"/>
                    <h1 className="text-4xl font-bold text-[#18981D]">QuizCraft</h1>
                </div>

                <div className="w-1/2 justify-items-start mx-auto my-5">
                    <div className="font-semibold justify-items-start text-3xl">
                        <h3>Reset password</h3>
                    </div>
                    <div className="text-gray-500 text-left">
                        <p>Enter the email address associated with your QuizCraft account.</p>
                    </div>

                    <form className="w-full" onSubmit={handleSubmit}>
                        
                        {/* Email input */}
                        <div className="flex flex-wrap -mx-3 my-4">
                            <div className="w-full px-3 justify-items-start">
                                <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="email">
                                    Email address
                                </label>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="email" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Student@gmail.com">
                                </input>
                            </div>
                        </div>

                        {message && <div className="success-message">{message}</div>}
                        {error && <div className="error-message">{error}</div>}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="block w-full text-xl text-white bg-[#18981D] py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:cursor-pointer"
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                Reset
                            </button>
                        </div>

                        <div className="flex items-center my-2 justify-center">
                            <hr className="flex-grow border-t border-zinc-300" />
                            <p className="mx-4 text-sm text-zinc-500">Or</p>
                            <hr className="flex-grow border-t border-zinc-300" />
                        </div>

                        <Link
                            to={"/login"}
                            className="block w-full text-xl py-2 px-4 mb-3 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:text-white hover:cursor-pointer"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}>
                            Back to Login
                        </Link>

                    </form>       
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;