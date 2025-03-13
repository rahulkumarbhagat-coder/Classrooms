import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
      },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    isTeacher: {
        type: Boolean,
        default: false,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    classrooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    }]
});

export const User = mongoose.model('User', userSchema)