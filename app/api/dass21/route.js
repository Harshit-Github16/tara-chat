import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { verifyToken } from "../../../lib/jwt";
import { ObjectId } from "mongodb";

// POST - Save DASS-21 assessment
export async function POST(req) {
    try {
        console.log('DASS-21 API: Starting POST request');

        // Get authorization header
        const authHeader = req.headers.get('authorization');
        console.log('DASS-21 API: Auth header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('DASS-21 API: No valid authorization header');
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            console.log('DASS-21 API: Invalid token');
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;
        console.log('DASS-21 API: Using userId:', userId);

        const { answers, scores, completedAt } = await req.json();
        console.log('DASS-21 API: Request body:', { answers: Object.keys(answers).length, scores, completedAt });

        if (!answers || !scores) {
            console.log('DASS-21 API: Missing required fields');
            return NextResponse.json({ error: 'Answers and scores are required' }, { status: 400 });
        }

        // Create assessment entry
        const assessment = {
            id: new ObjectId().toString(),
            answers,
            scores: {
                depression: scores.depression,
                anxiety: scores.anxiety,
                stress: scores.stress
            },
            completedAt: completedAt || new Date().toISOString(),
            createdAt: new Date()
        };
        console.log('DASS-21 API: Assessment created:', assessment.id);

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Check if user exists
        const existingUser = await users.findOne({ firebaseUid: userId });
        console.log('DASS-21 API: User found:', existingUser ? 'Yes' : 'No');

        if (!existingUser) {
            console.log('DASS-21 API: User not found');
            return NextResponse.json({
                error: 'User not found',
                debug: { userId }
            }, { status: 404 });
        }

        // Update user document - add assessment to dass21Assessments array
        const result = await users.updateOne(
            { firebaseUid: userId },
            {
                $push: {
                    dass21Assessments: {
                        $each: [assessment],
                        $position: 0 // Add to beginning of array
                    }
                },
                $set: { lastUpdated: new Date() }
            }
        );

        console.log('DASS-21 API: Update result - matched:', result.matchedCount, 'modified:', result.modifiedCount);

        return NextResponse.json({
            success: true,
            message: 'Assessment saved successfully',
            assessment
        });

    } catch (error) {
        console.error('DASS-21 API: Error saving assessment:', error);
        return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
    }
}

// GET - Retrieve DASS-21 assessments
export async function GET(req) {
    try {
        // Get authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 10; // Default 10 assessments

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user with assessments
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { dass21Assessments: 1 } }
        );

        if (!user) {
            return NextResponse.json({
                success: true,
                data: { assessments: [] }
            });
        }

        const allAssessments = user.dass21Assessments || [];
        const recentAssessments = allAssessments.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: { assessments: recentAssessments }
        });

    } catch (error) {
        console.error('DASS-21 API: Error fetching assessments:', error);
        return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }
}
