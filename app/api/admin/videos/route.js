import { NextResponse } from 'next/server';
import { Video } from '@/lib/models/Video';

export async function GET() {
    try {
        const videos = await Video.getAll();
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.url || !data.title) {
            return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
        }

        const video = new Video({
            title: data.title,
            description: data.description,
            url: data.url,
            category: data.category
        });

        const result = await video.save();
        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Error creating video:', error);
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await Video.deleteById(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }
}
