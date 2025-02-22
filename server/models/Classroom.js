import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    teachers: [{
        type: String,
        required: true,
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