const express = require('express');
const Lesson = require('../models/Lesson');
const Language = require('../models/Language');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lessons/language/:langId
router.get('/language/:langId', async (req, res) => {
    try {
        let lessons = await Lesson.find({
            languageId: req.params.langId,
            isPublished: true
        }).sort('order');

        // Dynamic Production-Ready Generation Intercept
        if (lessons.length === 0) {
            const language = await Language.findById(req.params.langId);
            if (language) {
                const { generateAndSeedCurriculum } = require('../services/aiCurriculum');
                await generateAndSeedCurriculum(language._id, language.name);

                // Re-fetch populated lessons
                lessons = await Lesson.find({
                    languageId: req.params.langId,
                    isPublished: true
                }).sort('order');
            }
        }

        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/lessons/:id
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('languageId');
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/lessons (Admin - all lessons)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('languageId').sort('languageId order');
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/lessons (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);

        // Update language total lessons count
        await Language.findByIdAndUpdate(req.body.languageId, { $inc: { totalLessons: 1 } });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/lessons/:id (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/lessons/:id (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        await Language.findByIdAndUpdate(lesson.languageId, { $inc: { totalLessons: -1 } });
        await Lesson.findByIdAndDelete(req.params.id);

        res.json({ message: 'Lesson removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
