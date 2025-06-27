import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['landlord', 'tenant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = {
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    // Return user data (without password)
    return NextResponse.json({
      id: result.insertedId.toString(),
      email,
      name,
      role,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 