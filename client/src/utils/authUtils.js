import { auth } from '../firebase/config';

export const getAuthToken = async () => {
    const user = auth.currentUser;
    if(user) {
        return await user.getIdToken();
    }
    throw new Error('No user logged in');
};