import express from "express";
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

export const authRouter = express.Router();

// Register new user
authRouter.post('/new-user', authMiddleware, async(req,res) => {
    try {
        const { uid, email } = req.user;

        const existingUser = await User.findOne({ firebaseUid: uid });
        if(existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Get user info from req body and validate required fields
        const { firstName, lastName, role } = req.body;
        if(!firstName || !lastName || !role ) {
            return res.status(400).json({ error: 'Please provide firstName, lastName, and role'});
        }

        // Create new user
        const newUser = await User.create({
            firebaseUid: uid, 
            email,
            firstName,
            lastName,
            role,
            classrooms: [],
            quizHistory: []
        })

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({error: 'Error creating user'});
    }
});
