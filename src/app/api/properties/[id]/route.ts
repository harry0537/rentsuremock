import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const propertyId = request.url.split('/').pop();
    const { db } = await connectToDatabase();

    if (!propertyId || !ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const property = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(propertyId) });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const propertyId = request.url.split('/').pop();
    const { db } = await connectToDatabase();
    const updates = await request.json();

    if (!propertyId || !ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('properties')
      .updateOne(
        { _id: new ObjectId(propertyId) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property updated' });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const propertyId = request.url.split('/').pop();
    const { db } = await connectToDatabase();

    if (!propertyId || !ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('properties')
      .deleteOne({ _id: new ObjectId(propertyId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
