const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    title: {
        type: String,
        default: 'Lesson Quiz'
    },
    questions: [{
        question: { type: String, required: true },
        questionType: {
            type: String,
            enum: ['multiple-choice', 'true-false', 'fill-blank', 'form-sentence', 'matching'],
            default: 'multiple-choice'
        },
        options: [{ type: String }],
        correctAnswer: { type: String, required: true },
        explanation: { type: String, default: '' },
        points: { type: Number, default: 10 }
    }],
    totalPoints: {
        type: Number,
        default: 0
    },
    passingScore: {
        type: Number,
        default: 60
    },
    timeLimit: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

quizSchema.pre('save', function (next) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
    next();
});

module.exports = mongoose.model('Quiz', quizSchema);
