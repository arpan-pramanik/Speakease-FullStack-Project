const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    order: {
        type: Number,
        required: true
    },
    content: {
        vocabulary: [{
            word: { type: String, required: true },
            translation: { type: String, required: true },
            pronunciation: { type: String, default: '' },
            example: { type: String, default: '' },
            exampleTranslation: { type: String, default: '' }
        }],
        grammarNotes: [{
            title: String,
            explanation: String,
            examples: [String]
        }]
    },
    estimatedMinutes: {
        type: Number,
        default: 10
    },
    xpReward: {
        type: Number,
        default: 25
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

lessonSchema.index({ languageId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
