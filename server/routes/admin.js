const express = require('express');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Language = require('../models/Language');
const Progress = require('../models/Progress');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalLessons = await Lesson.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();
        const totalLanguages = await Language.countDocuments();

        // Active users (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeUsers = await User.countDocuments({ lastActive: { $gte: weekAgo } });

        // Recent registrations (last 30 days)
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentSignups = await User.countDocuments({ createdAt: { $gte: monthAgo } });

        res.json({
            totalUsers,
            totalLessons,
            totalQuizzes,
            totalLanguages,
            activeUsers,
            recentSignups
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort('-createdAt');

        const usersWithProgress = await Promise.all(
            users.map(async (user) => {
                const progress = await Progress.findOne({ userId: user._id });
                return {
                    ...user.toObject(),
                    completedLessons: progress ? progress.completedLessons.length : 0,
                    quizzesTaken: progress ? progress.quizScores.length : 0,
                    totalXP: progress ? progress.totalXP : 0
                };
            })
        );

        res.json(usersWithProgress);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin user' });

        await Progress.findOneAndDelete({ userId: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
