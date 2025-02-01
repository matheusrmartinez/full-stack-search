import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { cities } from './seeds/cities';
import { countries } from './seeds/countries';
import { hotels } from './seeds/hotels';
import { env } from 'src/_config/env.js';

async function startAndSeedMemoryDB() {
  let mongod: MongoMemoryServer | null = null;
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        port: env.DATABASE_PORT,
      },
    });
    console.log('MongoMemoryServer started on', mongod.getUri());

    const uri = mongod.getUri();
    process.env.DATABASE_URL = uri;

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db();
      await db.collection('cities').insertMany(cities);
      await db.collection('countries').insertMany(countries);
      await db.collection('hotels').insertMany(hotels);
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error starting MongoMemoryServer:', error);
  }

  const shutdown = async () => {
    if (mongod) {
      console.log('Stopping MongoMemoryServer...');
      await mongod.stop();
    }
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startAndSeedMemoryDB();
