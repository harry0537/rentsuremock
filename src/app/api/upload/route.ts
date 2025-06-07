import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Mock successful upload response
    return NextResponse.json({
      success: true,
      url: 'https://placehold.co/600x400',
      message: 'Image upload simulated successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 