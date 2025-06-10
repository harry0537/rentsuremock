import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    // TODO: Replace with actual user creation logic
    // This is a mock implementation
    if (email && password && name && role) {
      return NextResponse.json({
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      });
    }

    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 