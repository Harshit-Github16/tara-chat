import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../../lib/jwt';
import { User } from '../../../../lib/models/User';

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

        // Get user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return user data (without password)
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                firebaseUid: user.firebaseUid, // Add firebaseUid
                uid: user.firebaseUid, // Also add as uid for compatibility
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                avatar: user.avatar,
                provider: user.provider,
                isOnboardingComplete: user.isOnboardingComplete,
                // Onboarding fields
                gender: user.gender,
                ageRange: user.ageRange,
                profession: user.profession,
                interests: user.interests,
                personalityTraits: user.personalityTraits,
                // Timestamps
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
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

        const body = await request.json();
        const {
            name,
            nickname,
            avatar,
            isOnboardingComplete,
            gender,
            ageRange,
            profession,
            interests,
            personalityTraits
        } = body;

        // Update user in database
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (nickname !== undefined) updateData.nickname = nickname;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (isOnboardingComplete !== undefined) updateData.isOnboardingComplete = isOnboardingComplete;
        if (gender !== undefined) updateData.gender = gender;
        if (ageRange !== undefined) updateData.ageRange = ageRange;
        if (profession !== undefined) updateData.profession = profession;
        if (interests !== undefined) updateData.interests = interests;
        if (personalityTraits !== undefined) updateData.personalityTraits = personalityTraits;

        await User.updateById(decoded.userId, updateData);

        // Get updated user
        const updatedUser = await User.findById(decoded.userId);

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser._id.toString(),
                firebaseUid: updatedUser.firebaseUid, // Add firebaseUid
                uid: updatedUser.firebaseUid, // Also add as uid for compatibility
                email: updatedUser.email,
                name: updatedUser.name,
                nickname: updatedUser.nickname,
                avatar: updatedUser.avatar,
                provider: updatedUser.provider,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                // Onboarding fields
                gender: updatedUser.gender,
                ageRange: updatedUser.ageRange,
                profession: updatedUser.profession,
                interests: updatedUser.interests,
                personalityTraits: updatedUser.personalityTraits,
                // Timestamps
                createdAt: updatedUser.createdAt,
                lastLoginAt: updatedUser.lastLoginAt
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}