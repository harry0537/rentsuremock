import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_request: NextRequest) {
  try {
    const maintenanceId: string | undefined = _request.url.split('/').pop();
    const { db } = await connectToDatabase();

    if (!maintenanceId || !ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance ID' },
        { status: 400 }
      );
    }

    const maintenance = await db
      .collection('maintenanceRequests')
      .findOne({ _id: new ObjectId(maintenanceId) });

    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance request' },
      { status: 500 }
    );
  }
}

export async function PUT(_request: NextRequest) {
  try {
    const maintenanceId: string | undefined = _request.url.split('/').pop();
    const { db } = await connectToDatabase();
    const updates = await _request.json();

    if (!maintenanceId || !ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance ID' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('maintenanceRequests')
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

export async function DELETE(_request: NextRequest) {
  try {
    const maintenanceId: string | undefined = _request.url.split('/').pop();
    const { db } = await connectToDatabase();

    if (!maintenanceId || !ObjectId.isValid(maintenanceId)) {
      return NextResponse.json(
        { error: 'Invalid maintenance ID' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('maintenanceRequests')
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
