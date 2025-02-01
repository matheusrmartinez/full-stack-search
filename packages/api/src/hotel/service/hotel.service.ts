import { ObjectId, type Collection, type MongoClient } from 'mongodb';
import { Hotel } from 'schemas';

export class HotelService {
  private collection: Collection<Hotel>;

  constructor(
    private readonly dbClient: MongoClient,
    private readonly collectionName = 'hotels',
  ) {
    this.collection = this.dbClient.db().collection<Hotel>(this.collectionName);
  }

  async searchHotels(search?: string) {
    const query = search
      ? {
          $or: [
            { chainName: { $regex: search, $options: 'i' } },
            { hotelName: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    return await this.collection.find(query).toArray();
  }
  async searchHotel(hotelId: string) {
    if (!ObjectId.isValid(hotelId)) {
      throw new Error('Invalid hotelId format');
    }
    const result = await this.collection.findOne({
      // @ts-ignore
      _id: new ObjectId(hotelId.trim()),
    });
    return result;
  }
}
