const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const authController = {
    // POST /api/auth/register
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ error: 'Email, password, and name are required' });
            }

            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            }

            const user = new User({
                email: email.toLowerCase(),
                password,
                name,
                provider: 'credentials'
            });

            try {
                await user.save();
            } catch (error) {
                if (error.message.includes('already exists')) {
                    return res.status(409).json({ error: 'User already exists with this email' });
                }
                throw error;
            }

            const createdUser = await User.findByEmail(email);

            const token = signToken({
                userId: createdUser._id.toString(),
                email: createdUser.email,
                name: createdUser.name
            });

            // In Microservices, we usually return token in body, gateway can set cookie if needed.
            // Or we can return cookie instruction.
            // For now returning in body + cookie for consistency.

            // Note: Native Express cannot set cookie directly to appear in nextjs easy without middleware
            // But standard practice is returning token.

            res.status(201).json({
                success: true,
                token, // Explicitly return token
                user: {
                    id: createdUser._id.toString(),
                    email: createdUser.email,
                    name: createdUser.name,
                    avatar: createdUser.avatar,
                    isOnboardingComplete: createdUser.isOnboardingComplete
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // POST /api/auth/login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const isValidPassword = await User.verifyPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            await User.updateLastLogin(user._id);

            const token = signToken({
                userId: user._id.toString(),
                email: user.email,
                name: user.name
            });

            res.json({
                success: true,
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    isOnboardingComplete: user.isOnboardingComplete
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authController;
