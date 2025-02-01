import { MongoClient } from 'mongodb';
import { env } from 'src/_config/env';

export default class MongoDBAdapter {
  private client: MongoClient | null = null;

  constructor() {
    (async () => {
      try {
        if (env.NODE_ENV !== 'production') {
          await import('./startAndSeedMemoryDB');
        }

        if (this.client) {
          console.info('MongoDB client already instantiated.');
          return this.client;
        }

        this.client = new MongoClient(env.DATABASE_URL);
        console.info('Connecting to MongoDB...');

        await this.client.connect();
        console.info('Successfully connected to MongoDB!');
        return this.client;
      } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
      }
    })().catch((error) => {
      console.error('Error in async function', error);
    });
  }

  getMongoClient(): MongoClient {
    if (!this.client) {
      throw new Error(
        'MongoDB client not connected. Please call connectToMongoDB first.',
      );
    }

    return this.client;
  }
}
