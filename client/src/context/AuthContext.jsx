import { useState, useEffect } from "react";
import { AuthContext } from "../utils/authUtils";
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    if (children === undefined) {
        throw new Error('AuthProvider requires a children prop');
    }

    const [userData, setUserData] = useState({
        user: null,
        loading: true,
        firstName: '',
        lastName: '',
        email: '',
        isTeacher: false,
        classrooms: [],
        quizzes: []
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUserData(prev => ({
                    ...prev,
                    user: null,
                    loading: false
                }));
                return;
            }
    
            try {
                const response = await fetch('http://localhost:5000/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${await currentUser.getIdToken()}`,
                    },
                });
    
                if (!response.ok) {
                    console.log("User not found");
                    setUserData(prev => ({
                        ...prev,
                        user: null,
                        loading: false
                    }));
                    return;
                }
    
                const userInfo = await response.json();
                console.log("USER INFO:", userInfo);
    
                setUserData({
                    user: currentUser,
                    loading: false,
                    firstName: userInfo.firstName || '',
                    lastName: userInfo.lastName || '',
                    email: userInfo.email || '',
                    isTeacher: userInfo.isTeacher || false,
                    classrooms: userInfo.classrooms || [],
                    quizzes: userInfo.quizzes || []
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(prev => ({
                    ...prev,
                    loading: false
                }));
            }
        });
    
        return () => unsubscribe();
    }, []);

    const handleLogin = async (email, password) => {
        setUserData(prev => ({
            ...prev,
            loading: true
        }));
        try {
            const user = await signInWithEmailAndPassword( auth,email,password);
            setUserData(prev => ({
                ...prev,
                user: user.user 
            }));
            window.location.href = '/';
        } catch(error) {
            console.error('Login error:', error);
        } finally {
            setUserData(prev => ({
                ...prev,
                loading: false
            }));
        }
    };

    const signInWithGoogle = async () => {
        setUserData(prev => ({
            ...prev,
            loading: true
        }));
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUserData(prev => ({
                ...prev,
                user: result.user
            }));
            window.location.href = '/';
        } catch(error) {
            console.error('Google login error:', error);
        } finally {
            setUserData(prev => ({
                ...prev,
                loading: false
            }));
        }
    };

    return (
        <AuthContext.Provider value={{ userData, handleLogin, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};