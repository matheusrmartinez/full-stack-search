import type { Collection, MongoClient } from 'mongodb';
import { Hotel } from '../types';

export class HotelService {
  private collection: Collection<Hotel>;

  constructor(
    private readonly dbClient: MongoClient,
    private readonly collectionName = 'hotels',
  ) {
    this.collection = this.dbClient.db().collection<Hotel>(this.collectionName);
  }

  async listHotels(): Promise<Hotel[]> {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      console.error('Error listing hotels:', error);
      throw new Error('Could not list hotels');
    }
  }
}
