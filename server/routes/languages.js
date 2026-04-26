const express = require('express');
const Language = require('../models/Language');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/languages
router.get('/', async (req, res) => {
    try {
        const languages = await Language.find({ isActive: true }).sort('languageName');
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/languages/:id
router.get('/:id', async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) return res.status(404).json({ message: 'Language not found' });
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/languages (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const language = await Language.create(req.body);
        res.status(201).json(language);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Language already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/languages/:id (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const language = await Language.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!language) return res.status(404).json({ message: 'Language not found' });
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/languages/:id (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const language = await Language.findByIdAndDelete(req.params.id);
        if (!language) return res.status(404).json({ message: 'Language not found' });
        res.json({ message: 'Language removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
