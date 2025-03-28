import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../utils/authUtils";
import { ClassroomContext } from "../utils/classroomUtils";

// eslint-disable-next-line react/prop-types
export const ClassroomProvider = ({ children }) => {
    if (children === undefined) {
        throw new Error('ClassroomProvider requires a children prop');
    }

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

    const { userData } = useAuth();

    const [classroomData, setClassroomData] = useState({
        classrooms: [],
        currentClassroom: null,
        students: [],
        quizzes: [],
        loading: false,
        error: null
    });

    // Fetch all classrooms for the current user
    const fetchClassrooms = useCallback(async () => {
        if (!userData.user) return;

        setClassroomData(prev => ({
            ...prev,
            loading: true
        }));

        try {
            const token = await userData.user.getIdToken();
            const response = await fetch(`${BASE_URL}class/user-classrooms`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch classrooms');
            }

            const classrooms = await response.json();
            setClassroomData(prev => ({
                ...prev,
                classrooms,
                loading: false
            }));
        } catch (error) {
            console.error("Error fetching classrooms:", error);
            setClassroomData(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
        }
    }, [userData.user, BASE_URL]);

    // Generate a random 6 charachter invite code
    const generateInviteCode = () => { 
        return Math.random().toString(36).slice(2, 8).toUpperCase();
    }

    // Create a new classroom
    const createClassroom = async (classDetails) => {

        setClassroomData(prev => ({
            ...prev,
            loading: true
        }));

        const inviteCode = generateInviteCode();

        try {
            const token = await userData.user.getIdToken();
            const response = await fetch(`${BASE_URL}class/new-classroom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ classDetails, inviteCode })
            });

            if (!response.ok) {
                throw new Error('Failed to create classroom');
            }

            const newClassroom = await response.json();
            
            // Update state with the new classroom
            setClassroomData(prev => ({
                ...prev,
                classrooms: [...prev.classrooms, newClassroom],
                currentClassroom: newClassroom,
                loading: false
            }));

            return newClassroom;
        } catch (error) {
            console.error("Error creating classroom:", error);
            setClassroomData(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            throw error;
        }
    };

    // Join a classroom using invite code
    const joinClassroom = async (inviteCode) => {
        if (!userData.user) return;

        setClassroomData(prev => ({
            ...prev,
            loading: true
        }));

        try {
            const token = await userData.user.getIdToken();
            const response = await fetch(`${BASE_URL}class/join-classroom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ inviteCode })
            });

            if (!response.ok) {
                throw new Error('Failed to join classroom');
            }

            const classroom = await response.json();
            
            setClassroomData(prev => ({
                ...prev,
                classrooms: [...prev.classrooms, classroom],
                currentClassroom: classroom,
                loading: false
            }));

            return classroom;
        } catch (error) {
            console.error("Error joining classroom:", error);
            setClassroomData(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            throw error;
        }
    };

    // Update classroom details
    const updateClassroom = async (classroomId, classDetails) => {
        if (!userData.user) return;

        setClassroomData(prev => ({
            ...prev,
            loading: true
        }));

        try {
            const token = await userData.user.getIdToken();
            const response = await fetch(`${BASE_URL}class/update-classroom/${classroomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({classDetails})
            });

            if (!response.ok) {
                throw new Error('Failed to update classroom');
            }

            const updatedClassroom = await response.json();
            
            setClassroomData(prev => ({
                ...prev,
                classrooms: prev.classrooms.map(classroom => 
                    classroom._id === classroomId ? updatedClassroom : classroom
                ),
                currentClassroom: prev.currentClassroom?._id === classroomId 
                    ? updatedClassroom 
                    : prev.currentClassroom,
                loading: false
            }));

            return updatedClassroom;
        } catch (error) {
            console.error("Error updating classroom:", error);
            setClassroomData(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            throw error;
        }
    };

    // Delete classroom
    const deleteClassroom = async (classroomId) => {
        if (!userData.user) return;

        setClassroomData(prev => ({
            ...prev,
            loading: true
        }));

        try {
            const token = await userData.user.getIdToken();
            const response = await fetch(`${BASE_URL}class/delete-classroom/${classroomId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete classroom');
            }

            // Remove the deleted classroom from state
            setClassroomData(prev => ({
                ...prev,
                classrooms: prev.classrooms.filter(classroom => 
                    classroom._id !== classroomId
                ),
                // If the deleted classroom was the current one, set currentClassroom to null
                currentClassroom: prev.currentClassroom?._id === classroomId 
                    ? null 
                    : prev.currentClassroom,
                loading: false
            }));

            return true; // Return success
        } catch (error) {
            console.error("Error deleting classroom:", error);
            setClassroomData(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            throw error;
        }
    };

    // Load classrooms when user auth changes
    useEffect(() => {
        if (userData.user && !userData.loading) {
            fetchClassrooms();
        }
    }, [fetchClassrooms,userData.user, userData.loading]);

    // Clear classroom data when user logs out
    useEffect(() => {
        if (!userData.user && !userData.loading) {
            setClassroomData({
                classrooms: [],
                currentClassroom: null,
                students: [],
                quizzes: [],
                loading: false,
                error: null
            });
        }
    }, [userData.user, userData.loading]);

    return (
        <ClassroomContext.Provider value={{ 
            classroomData,
            setClassroomData,
            fetchClassrooms,
            generateInviteCode,
            createClassroom,
            joinClassroom,
            updateClassroom,
            deleteClassroom,
        }}>
            {children}
        </ClassroomContext.Provider>
    );
};