import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Mock data for demonstration
const mockNotes: MaintenanceNote[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const maintenanceId = params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(maintenanceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid maintenance request ID' }),
        { status: 400 }
      );
    }

    const notes = await db
      .collection('maintenance_notes')
      .find({ maintenanceId: new ObjectId(maintenanceId) })
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(notes));
  } catch (error) {
    console.error('Error fetching maintenance notes:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch maintenance notes' }),
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const maintenanceId = params.id;
    const { content, userId, userRole } = await request.json();

    // Validate ObjectId
    if (!ObjectId.isValid(maintenanceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid maintenance request ID' }),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!content || !userId || !userRole) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
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

    return new Response(
      JSON.stringify({
        ...note,
        _id: result.insertedId,
      })
    );
  } catch (error) {
    console.error('Error adding maintenance note:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add maintenance note' }),
      { status: 500 }
    );
  }
} 