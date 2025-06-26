const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harinderhome:Harry%400537@cluster0.yk4m5zn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function testDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db('rentsure');
    const collection = db.collection('properties');
    
    const count = await collection.countDocuments();
    console.log(`📊 Total properties in database: ${count}`);
    
    if (count > 0) {
      const properties = await collection.find({}).toArray();
      console.log('🏠 Properties found:');
      properties.forEach((prop, index) => {
        console.log(`  ${index + 1}. ${prop.title} - $${prop.price}/month`);
      });
    } else {
      console.log('❌ No properties found in database');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testDatabase().catch(console.error); 