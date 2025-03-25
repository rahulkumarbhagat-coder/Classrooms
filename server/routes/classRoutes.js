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
        const subject = classDetails.subject;
        const gradeLevel = classDetails.gradeLevel;
        const description = classDetails.description;

        if(!name) {
            return res.status(400).json({ error: 'Please provide a name for the classroom'});
        }

        const generateInviteCode = () => { 
            return Math.random().toString(36).slice(2, 8).toUpperCase();
        }

        // Create new classroom
        const newClassroom = await Classroom.create({
            name,
            subject,
            gradeLevel,
            description,
            teachers: [uid.toString()],
            students: [],
            quizzes: [],
            inviteCode: generateInviteCode()
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

// Students can join classroom using invite code
classRouter.post('/join-classroom', authMiddleware, async(req,res) => {
    try{
        const { uid } = req.user;
        const { inviteCode } = req.body;

        console.log('inviteCode', inviteCode);
        console.log('uid', uid);

        // Find classroom by invite code
        const classroom = await Classroom.findOne({ inviteCode: inviteCode });

        if(!classroom) {
            return res.status(404).json({ error: 'Classroom not found'});
        }

        
        // Update user's classrooms array
        const student = await User.findOne({ firebaseUid: uid });
        
        if(!student) {
            return res.status(404).json({ error: 'Student not found'});
        }
        
        // Update classroom's students array
        await Classroom.findByIdAndUpdate(
            classroom._id,
            { $push: { students: student._id } },
            { new: true }
        );
        
        console.log('student', student);

        await User.findByIdAndUpdate(
            student._id,
            { $push: { classrooms: classroom._id } },
            { new: true }
        );

        res.status(200).json(classroom);

    } catch (error) {
        console.error('Error joining classroom:', error);
        res.status(500).json({error: 'Error joining classroom'});
    }
});