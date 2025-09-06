import mongoose from 'mongoose';

export async function initMongoConnection() {
  const user = process.env.MONGODB_USER;
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const clusterUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  const mongoUri = `mongodb+srv://${user}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(mongoUri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
}
