import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch user's favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user's favorites array, defaulting to empty array
    const favorites = user.favorites || [];
    return NextResponse.json(favorites);

  } catch (error) {
    console.error('GET favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST - Add property to favorites
export async function POST(request: NextRequest) {
  try {
    const { userId, propertyId } = await request.json();

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Verify property exists
    const property = await db.collection('properties').findOne({ 
      _id: new ObjectId(propertyId) 
    });
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Add property to user's favorites
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $addToSet: { favorites: propertyId },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Property added to favorites',
      propertyId 
    });

  } catch (error) {
    console.error('POST favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE - Remove property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { userId, propertyId } = await request.json();

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Remove property from user's favorites
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $pull: { favorites: propertyId },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Property removed from favorites',
      propertyId 
    });

  } catch (error) {
    console.error('DELETE favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
} 