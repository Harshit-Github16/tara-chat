import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com"
];

export async function GET(request) {
    try {
        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const usersCollection = db.collection('users');

        // Get user data
        const user = await usersCollection.findOne({
            firebaseUid: decoded.userId
        });

        if (!user) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        // Check if user email is in admin list
        const isAdminEmail = ADMIN_EMAILS.includes(user.email);

        // If user should be admin but isn't marked as admin, update them
        if (isAdminEmail && !user.isAdmin) {
            await usersCollection.updateOne(
                { firebaseUid: decoded.userId },
                { $set: { isAdmin: true, lastUpdated: new Date() } }
            );

            return NextResponse.json({
                success: true,
                message: 'Admin access granted',
                user: {
                    email: user.email,
                    isAdmin: true,
                    wasUpdated: true
                }
            });
        }

        return NextResponse.json({
            success: true,
            user: {
                email: user.email,
                isAdmin: user.isAdmin || false,
                wasUpdated: false
            }
        });

    } catch (error) {
        console.error('Admin check error:', error);
        return NextResponse.json({
            error: 'Failed to check admin access'
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const usersCollection = db.collection('users');

        // Get user data
        const user = await usersCollection.findOne({
            firebaseUid: decoded.userId
        });

        if (!user) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        // Check if user email is in admin list
        const isAdminEmail = ADMIN_EMAILS.includes(user.email);

        if (!isAdminEmail) {
            return NextResponse.json({
                error: 'Email not in admin list'
            }, { status: 403 });
        }

        // Force set admin access
        await usersCollection.updateOne(
            { firebaseUid: decoded.userId },
            { $set: { isAdmin: true, lastUpdated: new Date() } }
        );

        return NextResponse.json({
            success: true,
            message: 'Admin access granted',
            user: {
                email: user.email,
                isAdmin: true
            }
        });

    } catch (error) {
        console.error('Admin grant error:', error);
        return NextResponse.json({
            error: 'Failed to grant admin access'
        }, { status: 500 });
    }
}