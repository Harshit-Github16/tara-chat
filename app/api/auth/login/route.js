import { NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { signToken } from '../../../../lib/jwt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, provider } = body;

    if (provider === 'google') {
      // Redirect to Google OAuth
      return NextResponse.json({
        redirectUrl: '/api/auth/google'
      });
    }

    // Handle email/password login
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await User.updateLastLogin(user._id);

    // Create JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isOnboardingComplete: user.isOnboardingComplete
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}