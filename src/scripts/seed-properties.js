const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harinderhome:Harry%400537@cluster0.yk4m5zn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const sampleProperties = [
  {
    _id: new ObjectId('507f1f77bcf86cd799439011'),
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Recently renovated with modern amenities, hardwood floors, and stainless steel appliances. Walking distance to restaurants, shops, and public transportation.',
    price: 2500,
    location: '123 Main Street, Downtown, NY 10001',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
    ],
    verified: true,
    status: 'available',
    landlord: {
      name: 'Sarah Johnson',
      verified: true,
      rating: 4.8,
      reviews: 23
    },
    amenities: ['parking', 'gym', 'pool', 'laundry'],
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      parking: true,
      petsAllowed: false
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439012'),
    title: 'Cozy Suburban Family Home',
    description: 'Spacious 3-bedroom, 2.5-bathroom house in a quiet family-friendly neighborhood. Features include a large backyard, updated kitchen, fireplace, and attached garage. Perfect for families with children, close to excellent schools and parks.',
    price: 3200,
    location: '456 Oak Avenue, Suburban Heights, CA 90210',
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
    ],
    verified: true,
    status: 'available',
    landlord: {
      name: 'Michael Chen',
      verified: true,
      rating: 4.9,
      reviews: 31
    },
    amenities: ['parking', 'garden', 'fireplace', 'garage'],
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 1800,
      parking: true,
      petsAllowed: true
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

async function seedProperties() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('rentsure');
    const collection = db.collection('properties');
    
    // Clear existing properties
    await collection.deleteMany({});
    console.log('Cleared existing properties');
    
    // Insert sample properties
    await collection.insertMany(sampleProperties);
    console.log('Inserted sample properties successfully!');
    
    // Verify insertion
    const count = await collection.countDocuments();
    console.log(`Total properties in database: ${count}`);
    
  } catch (error) {
    console.error('Error seeding properties:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedProperties().catch(console.error); 