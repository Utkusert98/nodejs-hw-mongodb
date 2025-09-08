import mongoose from 'mongoose';
import { env } from '../utils/env.js';

const initMongoConnection = async () => {
  const MONGODB_USER = env('MONGODB_USER');
  const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
  const MONGODB_URL = env('MONGODB_URL');
  const MONGODB_DB = env('MONGODB_DB');
  const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  // const options = {
  //   serverSelectionTimeoutMS: 5000,
  //   socketTimeoutMS: 45000,
  // };

  try {
    // await mongoose.connect(mongoUri, options);
    await mongoose.connect(mongoUri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
export default initMongoConnection;
