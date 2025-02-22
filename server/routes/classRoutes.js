import express from "express";
import { Classroom } from '../models/Classroom.js';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const classRouter = express.Router();

// Create new classroom
classRouter.post('/new-classroom', authMiddleware, async(req,res) => {
    console.log('req.user', req.user);

    try {
        const { uid } = req.user;

        // Get classroom info from req body and validate required fields
        const { classDetails } = req.body;
        console.log('classDetails', classDetails);

        const name = classDetails.name;
        const description = classDetails.description;

        if(!name) {
            return res.status(400).json({ error: 'Please provide a name for the classroom'});
        }

        // Create new classroom
        const newClassroom = await Classroom.create({
            name,
            description,
            teachers: [uid.toString()],
            students: [],
            quizzes: []
        });

        const user = await User.findOne({ firebaseUid: uid });

        if(!user) {
            return res.status(404).json({ error: 'User not found'});    
        }

        // Update user's classrooms array
        await User.findByIdAndUpdate(
            user._id,
            { $push: { classrooms: newClassroom._id } },
            { new: true }
        );

        res.status(201).json(newClassroom);
    } catch (error) {
        console.error('Error creating classroom:', error);
        res.status(500).json({error: 'Error creating classroom'});
    }
});
