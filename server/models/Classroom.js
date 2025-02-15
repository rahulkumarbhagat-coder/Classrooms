import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    description: {
        type: String,
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

export const Classroom = mongoose.model('Classroom', classroomSchema)