const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress
router.get('/', protect, async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.user._id })
            .populate('completedLessons.lessonId')
            .populate('quizScores.quizId')
            .populate('currentLanguage');

        if (!progress) {
            progress = await Progress.create({ userId: req.user._id });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/progress/complete-lesson
router.post('/complete-lesson', protect, async (req, res) => {
    try {
        const { lessonId } = req.body;

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        let progress = await Progress.findOne({ userId: req.user._id });
        if (!progress) {
            progress = await Progress.create({ userId: req.user._id });
        }

        // Check if already completed
        const alreadyCompleted = progress.completedLessons.some(
            cl => cl.lessonId.toString() === lessonId
        );

        if (alreadyCompleted) {
            return res.json({ message: 'Lesson already completed', progress });
        }

        const xpEarned = lesson.xpReward || 25;

        progress.completedLessons.push({
            lessonId,
            completedAt: new Date(),
            xpEarned
        });
        progress.totalXP += xpEarned;
        progress.lastActivity = new Date();

        // Update streak
        const now = new Date();
        const lastActivity = new Date(progress.lastActivity);
        const diffHours = (now - lastActivity) / (1000 * 60 * 60);
        if (progress.streakDays === 0) {
            progress.streakDays = 1;
        } else if (diffHours >= 20 && diffHours < 48) {
            progress.streakDays += 1;
        } else if (diffHours >= 48) {
            progress.streakDays = 1;
        }
        if (progress.streakDays > progress.longestStreak) {
            progress.longestStreak = progress.streakDays;
        }

        // Badge checks
        const completedCount = progress.completedLessons.length;
        const badgeChecks = [
            { count: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
            { count: 5, name: 'Beginner Learner', description: 'Complete 5 lessons', icon: '📚' },
            { count: 10, name: 'Dedicated Student', description: 'Complete 10 lessons', icon: '🌟' },
            { count: 25, name: 'Language Explorer', description: 'Complete 25 lessons', icon: '🗺️' },
            { count: 50, name: 'Master Linguist', description: 'Complete 50 lessons', icon: '👑' }
        ];

        for (const badge of badgeChecks) {
            if (completedCount >= badge.count && !progress.badges.some(b => b.name === badge.name)) {
                progress.badges.push(badge);
            }
        }

        // Streak badges
        const streakBadges = [
            { days: 3, name: '3-Day Streak', description: 'Learn for 3 days in a row', icon: '🔥' },
            { days: 7, name: 'Week Warrior', description: 'Learn for 7 days in a row', icon: '💪' },
            { days: 30, name: 'Monthly Master', description: 'Learn for 30 days in a row', icon: '🏆' }
        ];

        for (const badge of streakBadges) {
            if (progress.streakDays >= badge.days && !progress.badges.some(b => b.name === badge.name)) {
                progress.badges.push(badge);
            }
        }

        await progress.save();

        // Update user XP and badges too
        await User.findByIdAndUpdate(req.user._id, {
            totalXP: progress.totalXP,
            streakDays: progress.streakDays,
            badges: progress.badges
        });

        res.json({ message: 'Lesson completed!', xpEarned, progress });
    } catch (error) {
        console.error('Complete Lesson Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/progress/submit-quiz
router.post('/submit-quiz', protect, async (req, res) => {
    try {
        const { quizId, lessonId, score, totalPoints, percentage } = req.body;

        let progress = await Progress.findOne({ userId: req.user._id });
        if (!progress) {
            progress = await Progress.create({ userId: req.user._id });
        }

        const passed = percentage >= 60;
        const xpEarned = Math.round(percentage / 2);

        progress.quizScores.push({
            quizId,
            lessonId,
            score,
            totalPoints,
            percentage,
            passed,
            completedAt: new Date()
        });

        progress.totalXP += xpEarned;
        progress.lastActivity = new Date();

        // Quiz badges
        if (percentage === 100 && !progress.badges.some(b => b.name === 'Perfect Score')) {
            progress.badges.push({
                name: 'Perfect Score',
                description: 'Score 100% on a quiz',
                icon: '💯'
            });
        }

        const quizCount = progress.quizScores.length;
        if (quizCount >= 10 && !progress.badges.some(b => b.name === 'Quiz Champion')) {
            progress.badges.push({
                name: 'Quiz Champion',
                description: 'Complete 10 quizzes',
                icon: '🏅'
            });
        }

        await progress.save();

        await User.findByIdAndUpdate(req.user._id, {
            totalXP: progress.totalXP,
            badges: progress.badges
        });

        res.json({ message: passed ? 'Quiz Passed!' : 'Quiz completed', xpEarned, passed, progress });
    } catch (error) {
        console.error('Submit Quiz Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/progress/leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const leaders = await Progress.find()
            .populate('userId', 'name avatar')
            .sort('-totalXP')
            .limit(20)
            .select('userId totalXP streakDays badges completedLessons');

        const leaderboard = leaders
            .filter(l => l.userId)
            .map((l, i) => ({
                rank: i + 1,
                userId: l.userId._id,
                name: l.userId.name,
                avatar: l.userId.avatar,
                totalXP: l.totalXP,
                streakDays: l.streakDays,
                lessonsCompleted: l.completedLessons.length,
                badgeCount: l.badges.length
            }));

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
