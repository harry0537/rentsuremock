import { NextResponse } from 'next/server';
import { Property } from '@/types/property';

// Mock data for demonstration (same as in properties/route.ts)
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown',
    price: 2000,
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      parking: true,
      petsAllowed: true,
    },
    images: ['/images/property1.jpg'],
    status: 'available',
    landlordId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = mockProperties.find(p => p.id === params.id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
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
    const propertyIndex = mockProperties.findIndex(p => p.id === params.id);
    
    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const updates = await request.json();
    const updatedProperty = {
      ...mockProperties[propertyIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockProperties[propertyIndex] = updatedProperty;
    return NextResponse.json(updatedProperty);
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
    const propertyIndex = mockProperties.findIndex(p => p.id === params.id);
    
    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    mockProperties.splice(propertyIndex, 1);
    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 