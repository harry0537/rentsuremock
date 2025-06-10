import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maintenanceId = params.id;
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance request ID' },
        { status: 400 }
      );
    }

    const notes = await db
      .collection('maintenance_notes')
      .find({ maintenanceId: new ObjectId(maintenanceId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(notes);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance notes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maintenanceId = params.id;
    const { db } = await connectToDatabase();
    const { content, userId, userRole } = await request.json();

    if (!ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance request ID' },
        { status: 400 }
      );
    }

    if (!content || !userId || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const note = {
      maintenanceId: new ObjectId(maintenanceId),
      content,
      userId: new ObjectId(userId),
      userRole,
      createdAt: new Date(),
    };

    const result = await db.collection('maintenance_notes').insertOne(note);

    return NextResponse.json(
      { ...note, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add maintenance note' },
      { status: 500 }
    );
  }
}
