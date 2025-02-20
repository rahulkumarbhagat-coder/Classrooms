import { useState, useEffect } from "react";
import { AuthContext } from "../utils/authUtils";
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    if (children === undefined) {
        throw new Error('AuthProvider requires a children prop');
    }

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};