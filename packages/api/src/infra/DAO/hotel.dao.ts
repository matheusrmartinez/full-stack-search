import { ObjectId, type Collection, type MongoClient } from 'mongodb';
import { Hotel } from 'schemas';

export class HotelDAO {
  private collection: Collection<Hotel>;
  private readonly collectionName = 'hotels';

  constructor(private readonly dbClient: MongoClient) {
    this.collection = this.dbClient.db().collection<Hotel>(this.collectionName);
  }

  async searchHotels(search?: string) {
    const regexPattern = new RegExp(search!, 'i');
    const query = search
      ? {
          $or: [
            { chainName: { $regex: regexPattern } },
            { hotelName: { $regex: regexPattern } },
            { city: { $regex: regexPattern } },
            { state: { $regex: regexPattern } },
            { zipCode: { $regex: regexPattern } },
            { country: { $regex: regexPattern } },
            { addressLine1: { $regex: regexPattern } },
            { addressLine2: { $regex: regexPattern } },
          ],
        }
      : {};
    return await this.collection.find(query).toArray();
  }
  async searchHotel(hotelId: string) {
    const result = await this.collection.findOne({
      // @ts-ignore
      _id: new ObjectId(hotelId.trim()),
    });
    return result;
  }
}
