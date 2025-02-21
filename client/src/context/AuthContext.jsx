import { useState, useEffect } from "react";
import { AuthContext } from "../utils/authUtils";
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

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
                    console.log("RESPONSE NOT OK");
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

    return (
        <AuthContext.Provider value={{ userData }}>
            {children}
        </AuthContext.Provider>
    );
};