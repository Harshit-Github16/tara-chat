import { NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { signToken } from '../../../../lib/jwt';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Create new user
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
                return NextResponse.json(
                    { error: 'User already exists with this email' },
                    { status: 409 }
                );
            }
            throw error;
        }

        // Get the created user (without password)
        const createdUser = await User.findByEmail(email);

        // Create JWT token
        const token = signToken({
            userId: createdUser._id.toString(),
            email: createdUser.email,
            name: createdUser.name
        });

        // Create response
        const response = NextResponse.json({
            success: true,
            user: {
                id: createdUser._id.toString(),
                email: createdUser.email,
                name: createdUser.name,
                avatar: createdUser.avatar,
                isOnboardingComplete: createdUser.isOnboardingComplete
            }
        });

        // Set JWT token in HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}