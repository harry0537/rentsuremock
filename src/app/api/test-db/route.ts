import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const { db } = await connectToDatabase();
    
    const collection = db.collection('properties');
    const count = await collection.countDocuments();
    const properties = await collection.find({}).limit(5).toArray();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      propertyCount: count,
      properties: properties.map(p => ({
        id: p._id,
        title: p.title,
        price: p.price
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    }, { status: 500 });
  }
} 