import { MongoClient } from 'mongodb';
import { env } from 'src/_config/env';

let client: MongoClient | null = null;

export async function connectToMongoDB(): Promise<void> {
  try {
    if (env.NODE_ENV !== 'production') {
      await import('./startAndSeedMemoryDB');
    }

    if (!client) {
      client = new MongoClient(env.DATABASE_URL);
      console.info('Connecting to MongoDB...');

      await client.connect();
      console.info('Successfully connected to MongoDB!');
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error(
      'MongoDB client not connected. Please call connectToMongoDB first.',
    );
  }

  return client;
}
