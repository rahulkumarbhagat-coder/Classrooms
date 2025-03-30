import express from "express";
import { Classroom } from '../models/Classroom.js';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const classRouter = express.Router();

// Get all classrooms
classRouter.get('/user-classrooms', authMiddleware, async(req, res) => {
    try {
        const { uid } = req.user;

        // Find the user to get their classroom IDs
        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let classrooms = [];

        // If user is a teacher, find classrooms where they are listed as a teacher
        if (user.isTeacher) {
            classrooms = await Classroom.find({ 
                teachers: uid.toString() 
            }).populate('quizzes');
        } else {
            // If user is a student, find classrooms where their _id is in the students array
            if (user.classrooms && user.classrooms.length > 0) {
                classrooms = await Classroom.find({
                    _id: { $in: user.classrooms }
                }).populate('quizzes');
            }
        }

        res.status(200).json(classrooms);
    } catch (error) {
        console.error('Error fetching user classrooms:', error);
        res.status(500).json({ error: 'Error fetching classrooms' });
    }
});

// Create new classroom
classRouter.post('/new-classroom', authMiddleware, async(req,res) => {
    console.log('req.user', req.user);

    try {
        const { uid } = req.user;

        // Get classroom info from req body and validate required fields
        const { classDetails, inviteCode } = req.body;
        console.log('classDetails', classDetails);

        const name = classDetails.name;
        const subject = classDetails.subject;
        const gradeLevel = classDetails.gradeLevel;
        const description = classDetails.description;

        if(!name) {
            return res.status(400).json({ error: 'Please provide a name for the classroom'});
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
            inviteCode: inviteCode
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

// Update classroom details
classRouter.put('/update-classroom/:id', authMiddleware, async(req,res) => {
    try {
        const { id } = req.params;
        const { classDetails } = req.body;

        // Validate required fields
        if (!classDetails.name || !classDetails.subject || !classDetails.gradeLevel) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Create update object with all possible fields
        const updateData = { 
            name: classDetails.name, 
            subject: classDetails.subject, 
            gradeLevel: classDetails.gradeLevel, 
            description: classDetails.description 
        };
        
        // Add inviteCode to update if it's provided
        if (classDetails.inviteCode) {
            updateData.inviteCode = classDetails.inviteCode;
        }

        // Update classroom details
        const updatedClassroom = await Classroom.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedClassroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        res.status(200).json(updatedClassroom);
    } catch (error) {
        console.error('Error updating classroom:', error);
        res.status(500).json({ error: 'Error updating classroom' });
    }
});

// Delete classroom
classRouter.delete('/delete-classroom/:id', authMiddleware, async(req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        // Find the classroom first to verify it exists and check permissions
        const classroom = await Classroom.findById(id);
        
        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        // Verify the user is a teacher of this classroom
        if (!classroom.teachers.includes(uid.toString())) {
            return res.status(403).json({ error: 'Not authorized to delete this classroom' });
        }

        // Remove classroom references from all users who have it
        await User.updateMany(
            { classrooms: id },
            { $pull: { classrooms: id } }
        );
        
        // Delete the classroom
        await Classroom.findByIdAndDelete(id);

        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
        console.error('Error deleting classroom:', error);
        res.status(500).json({ error: 'Error deleting classroom' });
    }
});

// Get students by IDs
classRouter.post('/students-in-class', authMiddleware, async(req,res) => {
    try {
        // First check if the requesting user is a teacher
        const { uid } = req.user;
        const teacher = await User.findOne({ firebaseUid: uid });
        
        if(!teacher || !teacher.isTeacher) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        // Get the array of student IDs from the request body
        const { studentIds } = req.body;
        
        if(!studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ error: 'Valid student IDs array required' });
        }
        
        // Fetch all users matching those IDs
        const students = await User.find({ _id: { $in: studentIds } }).select('-password');
        
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({error: 'Error fetching students'});
    }
});

// Remove student from classroom
classRouter.post('/remove-student', authMiddleware, async(req, res) => {
    try {
      const { classroomId, studentId } = req.body;
      const teacherId = req.user.uid;
      
      // Validate input
      if (!classroomId || !studentId) {
        return res.status(400).json({ error: 'Classroom ID and student ID are required' });
      }
      
      // Find the classroom
      const classroom = await Classroom.findById(classroomId);
      
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      
      // Verify teacher owns this classroom
      if (!classroom.teachers.includes(teacherId)) {
        return res.status(403).json({ error: 'Not authorized to modify this classroom' });
      }
      
      // Remove student from classroom
      classroom.students = classroom.students.filter(
        id => id.toString() !== studentId
      );
      
      // Save updated classroom
      await classroom.save();
      
      // Return updated classroom
      const updatedClassroom = await Classroom.findById(classroomId)
        .populate('students')
        .populate('quizzes');
        
      res.status(200).json(updatedClassroom);
      
    } catch (error) {
      console.error('Error removing student:', error);
      res.status(500).json({ error: 'Error removing student from classroom' });
    }
  });