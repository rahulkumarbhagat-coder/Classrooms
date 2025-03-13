import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config"
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/authUtils";
import loginImage from "./assets/login-image.png";
import studentIcon from "./assets/student-icon.png";
import teacherIcon from "./assets/teacher-icon.png";

function Register() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const { handleLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        role: 'student'
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
            
            // Get authentication token
            const token = await firebaseUser.getIdToken();
            const response = await fetch(`${apiUrl}/auth/new-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    isTeacher: formData.role === 'Teacher' ? true : false
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
            <img className="w-1/2 h-screen object-cover" src={loginImage} alt="A scrabble board with the tiles arranged to spell 'Learn'" />

            {/* Registration form taking up right half */}
            <div className="w-1/2 px-6 py-8">

                {/* QuizCraft heading */}
                <div className="flex gap-3">
                    <img src="Frame (2).svg" alt="logo" className="w-12 h-12"/>
                    <h1 className="text-4xl font-bold text-gray-900">QuizCraft</h1>
                </div>

                <div className="w-3/5 bg-amber-600 justify-items-start mx-auto">
                    <div className="my-5 font-semibold text-3xl">
                        <h3>Create an account</h3>
                    </div>

                    <form onSubmit={handleSubmit} >

                        {/* Account type buttons */}
                        <div className="flex justify-between gap-4 my-6">
                            <button 
                                className="w-48 py-4 bg-white text-black font-semibold rounded-xl shadow-xl hover:bg-emerald-600 transition-colors"
                                >
                            <img className="mx-auto" src={teacherIcon} alt="An icon for the teacher button" />
                                Teacher
                            </button>
                            <button 
                                className="w-48 py-4 bg-white text-black font-semibold rounded-xl shadow-xl hover:bg-emerald-600 transition-colors"
                                >
                            <img className="mx-auto"  src={studentIcon} alt="An icon for the student button" />
                                Student
                            </button>
                        </div>

                        {/* First and last name input */}
                        <div className="flex flex-wrap mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <input 
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                    id="firstName" 
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Jane"
                                    required>
                                </input>
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input 
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
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
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
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
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input 
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
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
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input 
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                                    id="confirmPassword" 
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange} 
                                    placeholder="Confirm your password"
                                    required>
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
                                        id="role"
                                        value={formData.role}
                                        onChange={handleChange}>
                                            <option>Student</option>
                                            <option>Teacher</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mb-4">{error}</div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:!bg-amber-500 hover:cursor-pointer"
                                >
                                Register
                            </button>
                        </div>

                        <Link to={'/login'} className="text-sm mb-4 hover:text-blue-700">Already have an account? Login!</Link>

                    </form>        
                </div>
            </div>
        </div>
    );
}

export default Register;