import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI && process.env.NODE_ENV !== 'development') {
  console.warn('MongoDB URI not found - some features may not work');
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fallback';
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    return { client, db };
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}