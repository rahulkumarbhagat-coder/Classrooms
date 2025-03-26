import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    title:{
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    type: {
        type: [String],
        enum: ['Multiple Choice', 'True/False', 'Short Answer', 'Essay'],
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
          return this.isInClassroom === true;
        }
    },
    generatedQuiz:{
        type: Object,
        required: true
    },
    results: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            result: {
                type: Object,

            },
            completedAt: {
                type: Date
            },
            attemptsUsed: {
                type: Number,
                default: 1
            }
        }
    ]
});

export const Quiz = mongoose.model('Quiz', quizSchema)