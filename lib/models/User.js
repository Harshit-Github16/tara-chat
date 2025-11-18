import clientPromise from '../mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export class User {
    constructor(data) {
        this.email = data.email;
        this.name = data.name;
        this.nickname = data.nickname || '';
        this.password = data.password;
        this.avatar = data.avatar || '';
        this.provider = data.provider || 'credentials';
        this.googleId = data.googleId || null;
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
        const client = await clientPromise;
        const db = client.db('tara');
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
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        return await users.findOne({ email });
    }

    // Find user by ID
    static async findById(id) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        return await users.findOne({ _id: new ObjectId(id) });
    }

    // Find user by Google ID
    static async findByGoogleId(googleId) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        return await users.findOne({ googleId });
    }

    // Find user by Firebase UID
    static async findByFirebaseUid(firebaseUid) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        return await users.findOne({ firebaseUid });
    }

    // Find user by UID (checks both firebaseUid and googleId)
    static async findByUid(uid) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        return await users.findOne({
            $or: [
                { firebaseUid: uid },
                { googleId: uid }
            ]
        });
    }

    // Update user
    static async updateById(id, updateData) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        updateData.updatedAt = new Date();

        return await users.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
    }

    // Update last login
    static async updateLastLogin(id) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        return await users.updateOne(
            { _id: new ObjectId(id) },
            { $set: { lastLoginAt: new Date() } }
        );
    }

    // Create or update Google user
    static async createOrUpdateGoogleUser(googleProfile) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        const existingUser = await users.findOne({
            $or: [
                { email: googleProfile.email },
                { googleId: googleProfile.id }
            ]
        });

        if (existingUser) {
            // Update existing user
            await users.updateOne(
                { _id: existingUser._id },
                {
                    $set: {
                        lastLoginAt: new Date(),
                        avatar: googleProfile.picture || existingUser.avatar,
                        name: googleProfile.name || existingUser.name
                    }
                }
            );

            // Ensure TARA AI exists in chatUsers for existing users
            if (!existingUser.chatUsers || existingUser.chatUsers.length === 0) {
                const defaultTara = {
                    id: "tara-ai",
                    name: "TARA AI",
                    type: "ai",
                    avatar: "/taralogo.jpg",
                    conversations: [],
                    createdAt: new Date()
                };

                await users.updateOne(
                    { _id: existingUser._id },
                    { $set: { chatUsers: [defaultTara] } }
                );

                existingUser.chatUsers = [defaultTara];
            }

            return { user: existingUser, isNewUser: false };
        } else {
            // Create new user with TARA AI by default
            const defaultTara = {
                id: "tara-ai",
                name: "TARA AI",
                type: "ai",
                avatar: "/taralogo.jpg",
                conversations: [],
                createdAt: new Date()
            };

            const newUser = {
                email: googleProfile.email,
                name: googleProfile.name,
                avatar: googleProfile.picture || '',
                provider: 'google',
                googleId: googleProfile.id,
                isOnboardingComplete: false,
                chatUsers: [defaultTara], // Add TARA by default
                moods: [], // Initialize empty moods array
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            };

            const result = await users.insertOne(newUser);
            return {
                user: { ...newUser, _id: result.insertedId },
                isNewUser: true
            };
        }
    }

    // Create or update Firebase user
    static async createOrUpdateFirebaseUser(firebaseProfile) {
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        const existingUser = await users.findOne({
            $or: [
                { email: firebaseProfile.email },
                { firebaseUid: firebaseProfile.uid }
            ]
        });

        if (existingUser) {
            // Update existing user
            await users.updateOne(
                { _id: existingUser._id },
                {
                    $set: {
                        lastLoginAt: new Date(),
                        avatar: firebaseProfile.avatar || existingUser.avatar,
                        name: firebaseProfile.name || existingUser.name,
                        firebaseUid: firebaseProfile.uid
                    }
                }
            );

            // Ensure TARA AI exists in chatUsers for existing users
            if (!existingUser.chatUsers || existingUser.chatUsers.length === 0) {
                const defaultTara = {
                    id: "tara-ai",
                    name: "TARA AI",
                    type: "ai",
                    avatar: "/taralogo.jpg",
                    conversations: [],
                    createdAt: new Date()
                };

                await users.updateOne(
                    { _id: existingUser._id },
                    { $set: { chatUsers: [defaultTara] } }
                );

                existingUser.chatUsers = [defaultTara];
            }

            return { user: existingUser, isNewUser: false };
        } else {
            // Create new user with TARA AI by default
            const defaultTara = {
                id: "tara-ai",
                name: "TARA AI",
                type: "ai",
                avatar: "/taralogo.jpg",
                conversations: [],
                createdAt: new Date()
            };

            const newUser = {
                email: firebaseProfile.email,
                name: firebaseProfile.name,
                avatar: firebaseProfile.avatar || '',
                provider: 'firebase',
                firebaseUid: firebaseProfile.uid,
                isOnboardingComplete: false,
                chatUsers: [defaultTara], // Add TARA by default
                moods: [], // Initialize empty moods array
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date()
            };

            const result = await users.insertOne(newUser);
            return {
                user: { ...newUser, _id: result.insertedId },
                isNewUser: true
            };
        }
    }
}