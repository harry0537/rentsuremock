import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Context = { params: { id: string } };

export async function GET(request: NextRequest, context: Context) {
  try {
    const propertyId = context?.params?.id;

    if (!ObjectId.isValid(propertyId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid property ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection('properties')
      .findOne({ _id: new ObjectId(propertyId) });

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
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
      JSON.stringify({ error: 'Failed to fetch property' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const propertyId = context?.params?.id;

    if (!ObjectId.isValid(propertyId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid property ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { db } = await connectToDatabase();
    const updates = await request.json();

    if (!updates || Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No updates provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await db
      .collection('properties')
      .findOneAndUpdate(
        { _id: new ObjectId(propertyId) },
        { 
          $set: { 
            ...updates,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('PATCH error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to update property' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const propertyId = context?.params?.id;

    if (!ObjectId.isValid(propertyId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid property ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection('properties')
      .findOneAndDelete({ _id: new ObjectId(propertyId) });

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ message: 'Property deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('DELETE error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to delete property' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
