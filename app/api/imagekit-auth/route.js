import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_F70JirliQ9BXD/kr2nflQG7h8xw=',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_O2xoakaQB+nFJirMJ/ni3Jmnenw=',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/exerovn5q'
});

export async function GET() {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error('ImageKit auth error:', error);
        return NextResponse.json(
            { error: 'Failed to generate authentication parameters' },
            { status: 500 }
        );
    }
}
