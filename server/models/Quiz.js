import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    type: {
        type: String,
        enum: ['mcq', 'true/false', 'written', 'mixture'],
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    isInClassroom: {
        type: String,
        enum: ['classroom', 'public'],
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        // Only required if type is 'classroom'
        required: function() {
          return this.isInClassroom === 'classroom';
        }
      }
});

export const Quiz = mongoose.model('Quiz', quizSchema)