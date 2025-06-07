import { NextResponse } from 'next/server';
import { Property } from '@/types/property';

// Mock data for demonstration
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
      petsAllowed: searchParams.get('petsAllowed') === 'true',
      city: searchParams.get('city') || undefined,
      state: searchParams.get('state') || undefined,
    };

    // Filter properties based on search params
    let filteredProperties = [...mockProperties];
    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.features.bedrooms >= filters.bedrooms!);
    }
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p => p.features.bathrooms >= filters.bathrooms!);
    }
    if (filters.petsAllowed !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.features.petsAllowed === filters.petsAllowed);
    }
    if (filters.city) {
      filteredProperties = filteredProperties.filter(p => 
        p.address.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters.state) {
      filteredProperties = filteredProperties.filter(p => 
        p.address.state.toLowerCase().includes(filters.state!.toLowerCase())
      );
    }

    return NextResponse.json(filteredProperties);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const property = await request.json();
    
    // TODO: Add validation and actual database storage
    const newProperty: Property = {
      ...property,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProperties.push(newProperty);
    return NextResponse.json(newProperty);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 