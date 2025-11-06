import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Test Firebase configuration
        const { auth } = await import('../../../lib/firebase');

        return NextResponse.json({
            success: true,
            message: 'Firebase configuration loaded successfully',
            authConfigured: !!auth,
            projectId: auth?.app?.options?.projectId || 'Not found'
        });
    } catch (error) {
        console.error('Firebase test error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Firebase configuration failed'
        }, { status: 500 });
    }
}