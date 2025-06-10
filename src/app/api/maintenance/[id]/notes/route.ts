import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Context = { params: { id: string } };

export async function GET(request: NextRequest, context: Context) {
  try {
    const maintenanceId = context?.params?.id;
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(maintenanceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid maintenance request ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
  } catch (err) {
    console.error('GET error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch maintenance notes' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    const maintenanceId = context?.params?.id;
    const { db } = await connectToDatabase();
    const { content, userId, userRole } = await request.json();

    if (!ObjectId.isValid(maintenanceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid maintenance request ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!content || !userId || !userRole) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
      JSON.stringify({ ...note, _id: result.insertedId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('POST error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to add maintenance note' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
