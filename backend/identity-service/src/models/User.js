const { getDb } = require('../config/db');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class User {
    constructor(data) {
        this.email = data.email;
        this.name = data.name;
        this.nickname = data.nickname || '';
        this.password = data.password;
        this.avatar = data.avatar || '';
        this.provider = data.provider || 'credentials';
        this.googleId = data.googleId || null;
        this.userPassword = data.userPassword; // Functional app password (distinct from provider pass)
        this.firebaseUid = data.firebaseUid || null;
        this.isOnboardingComplete = data.isOnboardingComplete || false;
        // Onboarding fields
        this.gender = data.gender || '';
        this.ageRange = data.ageRange || '';
        this.profession = data.profession || '';
        this.interests = data.interests || [];
        this.personalityTraits = data.personalityTraits || [];
        this.lifeAreas = data.lifeAreas || [];
        this.quizResults = data.quizResults || {};
        // Emotional onboarding fields
        this.currentMood = data.currentMood || null;
        this.personalityAnswers = data.personalityAnswers || [];
        this.supportPreference = data.supportPreference || null;
        this.archetype = data.archetype || null;
        // Chat and Mood data
        this.chatUsers = data.chatUsers || [];
        this.moods = data.moods || [];
        // Timestamps
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.lastLoginAt = data.lastLoginAt || new Date();
    }

    // Hash password before saving
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Save user to database
    async save() {
        const db = getDb();
        const users = db.collection('users');

        // Check if user already exists
        const existingUser = await users.findOne({ email: this.email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Hash password if it exists
        if (this.password) {
            await this.hashPassword();
        }

        const result = await users.insertOne({
            email: this.email,
            name: this.name,
            nickname: this.nickname,
            password: this.password,
            avatar: this.avatar,
            provider: this.provider,
            googleId: this.googleId,
            firebaseUid: this.firebaseUid,
            isOnboardingComplete: this.isOnboardingComplete,
            gender: this.gender,
            ageRange: this.ageRange,
            profession: this.profession,
            interests: this.interests,
            personalityTraits: this.personalityTraits,
            lifeAreas: this.lifeAreas,
            quizResults: this.quizResults,
            currentMood: this.currentMood,
            personalityAnswers: this.personalityAnswers,
            supportPreference: this.supportPreference,
            archetype: this.archetype,
            chatUsers: this.chatUsers,
            moods: this.moods,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            lastLoginAt: this.lastLoginAt
        });

        return result;
    }

    // Find user by email
    static async findByEmail(email) {
        const db = getDb();
        const users = db.collection('users');
        return await users.findOne({ email });
    }

    // Find user by ID
    static async findById(id) {
        const db = getDb();
        const users = db.collection('users');
        return await users.findOne({ _id: new ObjectId(id) });
    }

    // Find user by Firebase UID
    static async findByFirebaseUid(firebaseUid) {
        const db = getDb();
        const users = db.collection('users');
        return await users.findOne({ firebaseUid });
    }

    // Update user by ID
    static async updateById(id, data) {
        const db = getDb();
        const users = db.collection('users');
        const { ObjectId } = require('mongodb');

        // Remove _id from data if it exists
        const { _id, ...updateData } = data;

        return await users.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
    }

    // Find user by UID (if different from ObjectId)
    static async findByUid(uid) {
        const db = getDb();
        const users = db.collection('users');
        return await users.findOne({ uid }); // assuming a 'uid' field exists for some auth providers
    }

    // Update last login
    static async updateLastLogin(id) {
        const db = getDb();
        const users = db.collection('users');
        return await users.updateOne(
            { _id: new ObjectId(id) },
            { $set: { lastLoginAt: new Date() } }
        );
    }
}

module.exports = User;
