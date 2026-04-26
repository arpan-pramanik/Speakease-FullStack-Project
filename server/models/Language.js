const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    languageName: {
        type: String,
        required: [true, 'Please add a language name'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        maxlength: 5
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    icon: {
        type: String,
        default: '🌐'
    },
    totalLessons: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Language', languageSchema);
