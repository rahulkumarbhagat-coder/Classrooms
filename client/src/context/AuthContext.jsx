import { useState, useEffect } from "react";
import { AuthContext } from "../utils/authUtils";
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    if (children === undefined) {
        throw new Error('AuthProvider requires a children prop');
    }

    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const [userData, setUserData] = useState({
        user: null,
        loading: true,
        firstName: '',
        lastName: '',
        email: '',
        isTeacher: false,
        classrooms: [],
        quizzes: [],
        showAccountTypeModal: false
    });

    const fetchUserFromBackend = async (user) => {
        if (!user) return null;

        try {
            const response = await fetch(`${BASE_URL}/auth/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await user.getIdToken()}`,
                },
            });

            if (!response.ok) {
                console.log("User not found");
                return null;
            }

            const userInfo = await response.json();
            return userInfo;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('UseEffect');
            if (!currentUser) {
                setUserData(prev => ({
                    ...prev,
                    user: null,
                    loading: false
                }));
                return;
            }
            
            const user = await fetchUserFromBackend(currentUser);
            if (user) {
                setUserData(prev => ({
                    ...prev,
                    user: currentUser,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isTeacher: user.isTeacher,
                    classrooms: user.classrooms,
                    quizzes: user.quizzes,
                    loading: false
                }));
            } else {
                setUserData(prev => ({
                    ...prev,
                    user: currentUser,
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
            const user = await signInWithEmailAndPassword(auth,email,password);
                setUserData(prev => ({
                    ...prev,
                    user: user.user 
                }));
                window.location.href = '/';
        } catch(error) {
            console.error('Login error:', error);
            throw error;
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
            const user = result.user;

            const userInfo = await fetchUserFromBackend(user);
            
            if (userInfo) {
                // User exists in backend
                setUserData({
                    user: user,
                    loading: false,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    isTeacher: userInfo.isTeacher,
                    classrooms: userInfo.classrooms,
                    quizzes: userInfo.quizzes,
                    showTypeModal: false
                });
                
                window.location.href = '/';
            } else {
                // User doesn't exist in backend, show type modal
                setUserData(prev => ({
                    ...prev,
                    user: user,
                    email: user.email,
                    loading: false,
                    showTypeModal: true
                }));
            }
        } catch(error) {
            console.error('Google login error:', error);
            setUserData(prev => ({
                ...prev,
                loading: false
            }));
        } 
    };

    const handleAccountSelection = async (isTeacher) => {
        setUserData(prev => ({
            ...prev,
            loading: true
        }));

        try {
            const user = userData.user;
            const userInfo = {
                uid: user.uid,
                email: user.email,
                firstName: user.displayName.split(' ')[0] || '',
                lastName: user.displayName.split(' ')[1] || '',
                isTeacher: isTeacher
            };

            const token = await user.getIdToken();

            const response = await fetch(`${BASE_URL}/auth/new-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo)
            });

            if (!response.ok) {
                console.error('Error registering user');
                return;
            }

            const data = await response.json();
            setUserData(prev => ({
                ...prev,
                firstName: data.firstName,
                lastName: data.lastName,
                isTeacher: data.isTeacher,
                loading: false,
                showTypeModal: false
            }));
            window.location.href = '/';
        } catch(error) {
            console.error('Account selection error:', error);
            setUserData(prev => ({
                ...prev,
                loading: false
            }));
        }
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            setUserData(prev => ({
                ...prev,
                user: null,
                firstName: '',
                lastName: '',
                email: '',
                isTeacher: false,
                classrooms: [],
                quizzes: [],
                showAccountTypeModal: false
            }));
            window.location.reload();
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    }

    return (
        <AuthContext.Provider value={{ userData, setUserData, handleLogin, handleLogout, signInWithGoogle, handleAccountSelection }}>
            {children}
        </AuthContext.Provider>
    );
};