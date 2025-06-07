import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Mock data for demonstration
const mockNotes: MaintenanceNote[] = [];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const maintenanceId = params.id;

    // Validate ObjectId
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
    console.error('Error fetching maintenance notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance notes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const maintenanceId = params.id;
    const { content, userId, userRole } = await request.json();

    // Validate ObjectId
    if (!ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance request ID' },
        { status: 400 }
      );
    }

    // Validate required fields
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

    return NextResponse.json({
      ...note,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding maintenance note:', error);
    return NextResponse.json(
      { error: 'Failed to add maintenance note' },
      { status: 500 }
    );
  }
} 