import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Property } from '@/types/property';

// Sample data for development
const sampleProperties: Omit<Property, '_id'>[] = [
  {
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown',
    location: '123 Main St, City, State 12345',
    price: 2000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    ],
    verified: true,
    landlord: {
      name: 'John Doe',
      verified: true,
      rating: 4.5,
      reviews: 12,
    },
    amenities: ['Parking', 'Gym', 'Pool'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Luxury Penthouse',
    description: 'Stunning penthouse with city views',
    location: '456 High St, City, State 12345',
    price: 5000,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2500,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    ],
    verified: true,
    landlord: {
      name: 'Jane Smith',
      verified: true,
      rating: 4.8,
      reviews: 25,
    },
    amenities: ['Parking', 'Gym', 'Pool', 'Concierge'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const properties = await db.collection('properties').find({}).toArray();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const property = await request.json();
    const result = await db.collection('properties').insertOne({
      ...property,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
} 