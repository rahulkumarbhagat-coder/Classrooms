import { auth } from '../firebase/config';
import { createContext, useContext } from 'react';

export const getAuthToken = async () => {
    const user = auth.currentUser;
    if(user) {
        return await user.getIdToken();
    }
    throw new Error('No user logged in');
};

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};