import { MongoClient } from 'mongodb';
import sgMail from '@sendgrid/mail';

async function testSetup() {
  console.log('🔍 Testing RentSure Setup...\n');

  // Test MongoDB Connection
  console.log('Testing MongoDB Connection...');
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentsure');
    console.log('✅ MongoDB Connection Successful');
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
  }

  // Test SendGrid Configuration
  console.log('\nTesting SendGrid Configuration...');
  try {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid Configuration Successful');
    } else {
      console.log('⚠️ SendGrid API Key not found');
    }
  } catch (error) {
    console.error('❌ SendGrid Configuration Failed:', error);
  }

  // Test Environment Variables
  console.log('\nChecking Environment Variables...');
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'MONGODB_URI',
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are set');
  } else {
    console.log('❌ Missing environment variables:', missingVars.join(', '));
  }

  console.log('\n📋 Setup Test Complete');
}

testSetup(); 