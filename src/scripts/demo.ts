import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentsure';

async function getDemoStats() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  try {
    // Get total properties
    const totalProperties = await db.collection('properties').countDocuments();

    // Get total maintenance requests
    const totalRequests = await db.collection('maintenanceRequests').countDocuments();

    // Get requests by status
    const statusCounts = await db.collection('maintenanceRequests').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get requests by priority
    const priorityCounts = await db.collection('maintenanceRequests').aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get requests by category
    const categoryCounts = await db.collection('maintenanceRequests').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log('\n=== Demo Statistics ===');
    console.log(`Total Properties: ${totalProperties}`);
    console.log(`Total Maintenance Requests: ${totalRequests}`);
    
    console.log('\nRequests by Status:');
    statusCounts.forEach(({ _id, count }) => {
      console.log(`- ${_id}: ${count}`);
    });

    console.log('\nRequests by Priority:');
    priorityCounts.forEach(({ _id, count }) => {
      console.log(`- ${_id}: ${count}`);
    });

    console.log('\nRequests by Category:');
    categoryCounts.forEach(({ _id, count }) => {
      console.log(`- ${_id}: ${count}`);
    });

    console.log('\nDemo Accounts:');
    console.log('Landlord: demo@rentsure.com / Demo@123');
    console.log('Tenant: tenant@rentsure.com / Demo@123');

  } catch (error) {
    console.error('Error getting demo stats:', error);
  } finally {
    await client.close();
  }
}

getDemoStats(); 