import { NextResponse } from 'next/server';
import { MaintenanceRequest } from '@/types/maintenance';
import { sendMaintenanceNotification } from '@/lib/email';

// Mock data for demonstration
let maintenanceRequests = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    title: 'Leaking Faucet',
    description: 'The kitchen faucet is leaking water.',
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const request = maintenanceRequests.find(r => r.id === params.id);
    if (!request) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const requestIndex = maintenanceRequests.findIndex(r => r.id === params.id);
    
    if (requestIndex === -1) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    const updatedRequest = {
      ...maintenanceRequests[requestIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    maintenanceRequests[requestIndex] = updatedRequest;

    // Send email notification if status is updated
    if (body.status) {
      try {
        await sendMaintenanceNotification(
          'tenant@example.com', // This should be fetched from the user's profile
          `Maintenance Request Update: ${updatedRequest.title}`,
          updatedRequest.id,
          updatedRequest.status,
          '123 Main Street' // This should be fetched from the property details
        );
      } catch (error) {
        console.error('Failed to send email notification:', error);
        // Continue with the update even if email fails
      }
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const requestIndex = maintenanceRequests.findIndex(r => r.id === params.id);
    
    if (requestIndex === -1) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    maintenanceRequests = maintenanceRequests.filter(r => r.id !== params.id);
    return NextResponse.json({ message: 'Maintenance request deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 