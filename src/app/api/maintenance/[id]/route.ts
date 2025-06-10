import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const maintenanceId = request.url.split('/').pop();
    const { db } = await connectToDatabase();

    if (!maintenanceId || !ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance request ID' },
        { status: 400 }
      );
    }

    const request = await db
      .collection('maintenance_requests')
      .findOne({ _id: new ObjectId(maintenanceId) });

    if (!request) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const maintenanceId = request.url.split('/').pop();
    const { db } = await connectToDatabase();
    const updates = await request.json();

    if (!maintenanceId || !ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance request ID' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('maintenance_requests')
      .updateOne(
        { _id: new ObjectId(maintenanceId) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Maintenance request updated' });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update maintenance request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const maintenanceId = request.url.split('/').pop();
    const { db } = await connectToDatabase();

    if (!maintenanceId || !ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance request ID' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('maintenance_requests')
      .deleteOne({ _id: new ObjectId(maintenanceId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Maintenance request deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete maintenance request' },
      { status: 500 }
    );
  }
}
