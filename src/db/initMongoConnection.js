import mongoose from 'mongoose';

export async function initMongoConnection() {
  const user = process.env.MONGODB_USER;
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const clusterUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  const mongoUri = `mongodb+srv://${user}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connection successfully established!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}