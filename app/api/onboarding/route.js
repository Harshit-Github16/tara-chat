import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/jwt';
import { User } from '../../../lib/models/User';

export async function PUT(request) {
    try {
        console.log('Onboarding API called');
        console.log('Headers:', Object.fromEntries(request.headers.entries()));
        console.log('Cookies:', request.cookies.getAll());

        const token = getTokenFromRequest(request);
        console.log('Token extracted:', token ? 'Present' : 'Missing');

        if (!token) {
            console.error('No token provided in request');
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            name,
            nickname,
            gender,
            ageRange,
            profession,
            interests,
            personalityTraits,
            lifeAreas
        } = body;

        // Validate required fields
        if (!name || !nickname) {
            return NextResponse.json(
                { error: 'Name and nickname are required' },
                { status: 400 }
            );
        }

        // Update user in database with onboarding data
        const updateData = {
            name,
            nickname,
            gender: gender || '',
            ageRange: ageRange || '',
            profession: profession || '',
            interests: interests || [],
            personalityTraits: personalityTraits || [],
            lifeAreas: lifeAreas || [],
            isOnboardingComplete: true,
            updatedAt: new Date()
        };

        await User.updateById(decoded.userId, updateData);

        // Get updated user data
        const updatedUser = await User.findById(decoded.userId);

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found after update' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Onboarding completed successfully',
            user: {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                name: updatedUser.name,
                nickname: updatedUser.nickname,
                avatar: updatedUser.avatar,
                provider: updatedUser.provider,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                gender: updatedUser.gender,
                ageRange: updatedUser.ageRange,
                profession: updatedUser.profession,
                interests: updatedUser.interests,
                personalityTraits: updatedUser.personalityTraits,
                lifeAreas: updatedUser.lifeAreas,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
                lastLoginAt: updatedUser.lastLoginAt
            }
        });

    } catch (error) {
        console.error('Onboarding update error:', error);
        return NextResponse.json(
            { error: 'Failed to update onboarding data' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);

        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get user data for onboarding
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                avatar: user.avatar,
                provider: user.provider,
                isOnboardingComplete: user.isOnboardingComplete,
                gender: user.gender,
                ageRange: user.ageRange,
                profession: user.profession,
                interests: user.interests,
                personalityTraits: user.personalityTraits,
                lifeAreas: user.lifeAreas,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: user.lastLoginAt
            }
        });

    } catch (error) {
        console.error('Get onboarding data error:', error);
        return NextResponse.json(
            { error: 'Failed to get onboarding data' },
            { status: 500 }
        );
    }
}