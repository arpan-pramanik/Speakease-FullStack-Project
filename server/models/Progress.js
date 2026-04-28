const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    completedLessons: [{
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        completedAt: { type: Date, default: Date.now },
        xpEarned: { type: Number, default: 0 }
    }],
    quizScores: [{
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        score: Number,
        totalPoints: Number,
        percentage: Number,
        passed: Boolean,
        completedAt: { type: Date, default: Date.now }
    }],
    streakDays: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    totalXP: {
        type: Number,
        default: 0
    },
    badges: [{
        name: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    currentLanguage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    }
}, {
    timestamps: true
});

progressSchema.index({ totalXP: -1 });

module.exports = mongoose.model('Progress', progressSchema);
