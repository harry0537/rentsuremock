import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, context: any) {
  try {
    const maintenanceId = context?.params?.id;

    if (!ObjectId.isValid(maintenanceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid maintenance ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection('maintenance_requests')
      .findOne({ _id: new ObjectId(maintenanceId) });

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Maintenance request not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch maintenance request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
