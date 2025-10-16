import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Hide password
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully to:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export default mongoose;
