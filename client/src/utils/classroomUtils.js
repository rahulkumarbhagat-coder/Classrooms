import { createContext, useContext } from 'react';

export const ClassroomContext = createContext();

export const useClassroom = () => {
    const context = useContext(ClassroomContext);
    if (!context) {
        throw new Error('useClassroom must be used within a ClassroomProvider');
    }
    return context;
};