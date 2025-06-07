import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Types (optional, but recommended for future scalability)
interface MaintenanceNote {
  maintenanceId: ObjectId;
  content: string;
  userId: ObjectId;
  userRole: string;
  createdAt: Date;
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const maintenanceId = context.params.id;

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

    return new Response(JSON.stringify(notes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
  context: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const maintenanceId = context.params.id;
    const { content, userId, userRole } = await request.json();

    if (!ObjectId.isValid(maintenanceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid maintenance request ID' }),
        { status: 400 }
      );
    }

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
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error adding maintenance note:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add maintenance note' }),
      { status: 500 }
    );
  }
}
