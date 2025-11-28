import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing connection to:', MONGODB_URI?.split('@')[1]); // Log only the host part for safety

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Successfully connected to MongoDB!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
