import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config"
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/authUtils";
import AccountTypeModal from "../../components/modals/AccountTypeModal";
import loginImage from "./assets/login-image.png";
import studentIcon from "./assets/student-icon.png";
import teacherIcon from "./assets/teacher-icon.png";
import logoImage from "./assets/logo.png";

function Register() {

    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

    const { handleLogin, signInWithGoogle, userData } = useAuth();

    const [isTeacher, setIsTeacher] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        role: 'Student'
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Registering user", formData);

        // Validate matching passwords
        if(formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            console.log("Passwords do not match")
            return;
        } else if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            console.log("Password must be at least 6 characters")   
            return;
        }

        try {
            setError(null);
            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(
                auth, formData.email, formData.password
            );

            const firebaseUser = userCredential.user
            console.log("FBU",firebaseUser)

            if(isTeacher === null) {
                setError('Please select an account type');  
                return;
            }
            
            // Get authentication token
            const token = await firebaseUser.getIdToken();
            const response = await fetch(`${BASE_URL}auth/new-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    isTeacher: isTeacher,
                })
            });

            if(!response.ok) {
                throw new Error('Failed to create user');
            }

            const data = await response.json();
            console.log(data);

            // Log in user
            handleLogin(formData.email, formData.password);

            // Log in success message before redirecting home
            window.confirm('User created successfully!');
            if(confirm.okay) {
                window.location.href = '/home';
            }
        } catch(error) {
            console.error('Registration error:', error);
            setError(error.message);
        }
    };

    
    return (
        <div className="flex">

            {/* Login image taking up left half */}
            <img className="fixed left-0 top-0 w-1/2 h-screen object-cover" src={loginImage} alt="A scrabble board with the tiles arranged to spell 'Learn'" />

            {/* Registration form taking up right half */}
            <div className="ml-[50%] h-screen bg-white w-1/2 px-6 py-6">

                {/* QuizCraft heading */}
                <div className="flex gap-3 my-3">
                    <img src={logoImage} alt="logo" className="w-12 h-12 text-[#18981D] fill-curent"/>
                    <h1 className="text-4xl font-bold text-[#18981D]">QuizCraft</h1>
                </div>

                <div className="w-1/2 justify-items-start mx-auto">
                    <div className="font-semibold text-3xl">
                        <h3>Create an account</h3>
                    </div>

                    <form className="w-full" onSubmit={handleSubmit} >

                        {/* Account type buttons */}
                        <div className="flex justify-between gap-4 my-4">
                            <button 
                                type="button"
                                onClick={() => setIsTeacher(true)}
                                className={`w-48 py-5 font-semibold rounded-xl  ${isTeacher === true ? 'bg-[#18981D] text-white' : 'bg-white text-black hover:bg-[#51CA58] hover:text-white transition-colors duration-200 group'}`}
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                <img className={`mx-auto ${isTeacher === true ? 'brightness-0 invert transition-filter duration-200' : 'group-hover:brightness-0 group-hover:invert transition-filter duration-200'}`} src={teacherIcon} alt="An icon for the teacher button" />
                                Teacher
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsTeacher(false)}
                                className={`w-48 py-5 font-semibold rounded-xl  ${isTeacher === false ? 'bg-[#18981D] text-white' : 'bg-white text-black hover:bg-[#51CA58] hover:text-white transition-colors duration-200 group'}`}
                                style={{ 
                                    boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                }}>
                                <img className={`mx-auto ${isTeacher === false ? 'brightness-0 invert transition-filter duration-200' : 'group-hover:brightness-0 group-hover:invert transition-filter duration-200'}`} src={studentIcon} alt="An icon for the student button" />
                                Student
                            </button>
                        </div>

                        {/* First and last name input */}
                        <div className="flex mb-3 gap-3">
                            <div className="md:w-1/2 justify-items-start">
                                <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="firstName">
                                    First name
                                </label>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="firstName" 
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Jane"
                                    required>
                                </input>
                            </div>
                            <div className="md:w-1/2 justify-items-start">
                                <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="lastName" 
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="Doe"
                                    required>
                                </input>
                            </div>
                        </div>

                        {/* Email input */}
                        <div className="flex flex-wrap -mx-3 mb-3">
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Student@gmail.com"
                                    required>
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
                                    <span className="text-sm text-gray-400 font-semibold">Must be at least 6 characters</span>
                                </div>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="password" 
                                    type="password" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required>
                                </input>
                            </div>
                        </div>

                        {/* Confirm password input */}
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3 justify-items-start">
                                <label className="block tracking-wide text-gray-700 text-lg font-semibold mb-1" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input 
                                    className="block w-full text-gray-700 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    style={{ 
                                        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    id="confirmPassword" 
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange} 
                                    placeholder="Confirm your password"
                                    required>
                                </input>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mb-3">{error}</div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="block w-full text-xl text-white bg-[#18981D] py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline hover:bg-[#51CA58] hover:cursor-pointer"
                            style={{ 
                                boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)"
                            }}>
                            Sign up
                        </button>

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
                            Sign up with Google Account
                        </button>

                        <Link to={'/login'} className="hover:text-[#18981D]">Already have an account? <u><b>Log in</b></u> now</Link>

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

export default Register;