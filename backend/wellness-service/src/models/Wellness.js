const mongoose = require('mongoose');

const wellnessSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    quizResults: { type: Map, of: Object, default: {} },
    lifeAreas: { type: Array, default: [] },
    moods: [{
        id: String,
        mood: String,
        intensity: Number,
        note: String,
        date: String,
        timestamp: Date,
        createdAt: Date
    }],
    journals: [{
        _id: String,
        title: String,
        content: String,
        tags: [String],
        date: String,
        createdAt: Date,
        updatedAt: Date
    }],
    goals: [{
        id: String,
        title: String,
        category: String,
        targetDays: Number,
        description: String,
        why: String,
        howToAchieve: String,
        progress: Number,
        checkIns: [String],
        completed: Boolean,
        completedAt: Date,
        source: String,
        dassScores: Object,
        createdAt: Date,
        updatedAt: Date
    }],
    dass21Assessments: [{
        scores: Object,
        results: Object,
        completedAt: Date
    }],
    stressCheckResults: [{
        score: Number,
        level: String,
        answers: Array,
        completedAt: Date
    }],
    emotionalWheelData: [{
        emotion: String,
        intensity: Number,
        date: Date
    }],
    onboardingEmotionalStatus: {
        completed: Boolean,
        lastStep: String,
        updatedAt: Date
    },
    reflectionRadar: {
        scores: Object,
        answers: Array,
        completedAt: Date,
        updatedAt: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Wellness', wellnessSchema, 'wellness_data');
