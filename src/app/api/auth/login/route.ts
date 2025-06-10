import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with actual authentication logic
    // This is a mock implementation
    if (email === 'test@example.com' && password === 'password') {
      return NextResponse.json({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'landlord',
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 