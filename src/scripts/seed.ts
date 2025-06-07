import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentsure';

async function seed() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  try {
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('properties').deleteMany({});
    await db.collection('maintenanceRequests').deleteMany({});

    // Create demo users
    const landlordPassword = await hash('Demo@123', 12);
    const tenantPassword = await hash('Demo@123', 12);

    const landlord = await db.collection('users').insertOne({
      email: 'demo@rentsure.com',
      password: landlordPassword,
      role: 'landlord',
      name: 'Demo Landlord',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const tenant = await db.collection('users').insertOne({
      email: 'tenant@rentsure.com',
      password: tenantPassword,
      role: 'tenant',
      name: 'Demo Tenant',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create demo properties
    const properties = await db.collection('properties').insertMany([
      {
        name: 'Sunset Apartments',
        address: '123 Sunset Blvd, Los Angeles, CA 90028',
        type: 'apartment',
        units: 12,
        landlordId: landlord.insertedId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ocean View Condos',
        address: '456 Beach Road, Santa Monica, CA 90401',
        type: 'condo',
        units: 8,
        landlordId: landlord.insertedId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create demo maintenance requests
    const maintenanceRequests = await db.collection('maintenanceRequests').insertMany([
      {
        propertyId: properties.insertedIds[0],
        tenantId: tenant.insertedId,
        title: 'Leaking Faucet in Kitchen',
        description: 'The kitchen faucet has been leaking for the past week. Water is pooling under the sink.',
        status: 'pending',
        priority: 'medium',
        category: 'plumbing',
        tags: ['kitchen', 'water', 'urgent'],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        propertyId: properties.insertedIds[0],
        tenantId: tenant.insertedId,
        title: 'AC Not Working',
        description: 'The air conditioning unit is not cooling properly. Temperature is set to 72°F but room is at 80°F.',
        status: 'in_progress',
        priority: 'high',
        category: 'hvac',
        tags: ['ac', 'temperature', 'summer'],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        propertyId: properties.insertedIds[1],
        tenantId: tenant.insertedId,
        title: 'Broken Window Lock',
        description: 'The window lock in the living room is broken and cannot be secured.',
        status: 'completed',
        priority: 'low',
        category: 'structural',
        tags: ['window', 'security'],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  } finally {
    await client.close();
  }
}

seed(); 