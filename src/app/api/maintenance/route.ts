import { NextResponse } from 'next/server';
import { MaintenanceRequest } from '@/types/maintenance';

// Mock data for demonstration
const mockRequests: MaintenanceRequest[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    let filteredRequests = [...mockRequests];
    if (propertyId) {
      filteredRequests = filteredRequests.filter(request => request.propertyId === propertyId);
    }

    return NextResponse.json(filteredRequests);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // TODO: Add validation and actual database storage
    const newRequest: MaintenanceRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockRequests.push(newRequest);
    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 