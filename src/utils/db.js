import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      console.error('MONGO_DB_URI is not defined in the .env file');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};
