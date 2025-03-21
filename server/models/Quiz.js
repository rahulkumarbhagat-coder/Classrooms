import mongoose from 'mongoose';
import { type } from 'os';

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
        type: Boolean,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    startingAt:{
        type: Date
    },
    endingAt:{
        type: Date
    },
    attempts:{
        type: Number,
        default: 1
    },
    status:{
      type: String,
      enum: ['active', 'draft', 'closed'],
      default: 'draft'
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        // Only required if type is 'classroom'
        required: function() {
          return this.isInClassroom === 'classroom';
        }
      },
      generatedQuiz:{
        type: Object,
        required: true
      }
});

export const Quiz = mongoose.model('Quiz', quizSchema)