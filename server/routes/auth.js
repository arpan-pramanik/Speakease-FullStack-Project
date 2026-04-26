const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

// @route   POST /api/auth/register
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({ name, email, password });

        // Create initial progress record
        await Progress.create({ userId: user._id });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                streakDays: user.streakDays,
                totalXP: user.totalXP,
                badges: user.badges
            }
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update streak
        const now = new Date();
        const lastActive = new Date(user.lastActive);
        const diffHours = (now - lastActive) / (1000 * 60 * 60);
        if (diffHours >= 24 && diffHours < 48) {
            user.streakDays += 1;
        } else if (diffHours >= 48) {
            user.streakDays = 1;
        }
        user.lastActive = now;
        await user.save();

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                streakDays: user.streakDays,
                totalXP: user.totalXP,
                badges: user.badges,
                selectedLanguage: user.selectedLanguage
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('selectedLanguage');
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            streakDays: user.streakDays,
            totalXP: user.totalXP,
            badges: user.badges,
            selectedLanguage: user.selectedLanguage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/auth/select-language
router.put('/select-language', protect, async (req, res) => {
    try {
        const { languageId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { selectedLanguage: languageId },
            { new: true }
        ).populate('selectedLanguage');

        // Update progress current language
        await Progress.findOneAndUpdate(
            { userId: req.user._id },
            { currentLanguage: languageId },
            { upsert: true }
        );

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/google
// @desc    Authenticate with Google OAuth token
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        // Verify the Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Find existing user or create new one
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user from Google profile (random password since they use OAuth)
            const randomPassword = require('crypto').randomBytes(32).toString('hex');
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: randomPassword,
                avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c4f000&color=050505`
            });

            // Create initial progress record
            await Progress.create({ userId: user._id });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                streakDays: user.streakDays,
                totalXP: user.totalXP,
                badges: user.badges,
                selectedLanguage: user.selectedLanguage
            }
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

module.exports = router;
