import { ObjectId, type Collection, type MongoClient } from 'mongodb';
import type { City } from 'schemas';
export class CityDAO {
  private collection: Collection<City>;
  constructor(
    private readonly dbClient: MongoClient,
    private readonly collectionName = 'cities',
  ) {
    this.collection = this.dbClient.db().collection<City>(this.collectionName);
  }
  async searchCities(search?: string) {
    const query = search
      ? {
          name: { $regex: search, $options: 'i' },
        }
      : {};
    return await this.collection.find(query).toArray();
  }
  async searchCity(cityId: string) {
    const result = await this.collection.findOne({
      // @ts-ignore
      _id: new ObjectId(cityId.trim()),
    });
    return result;
  }
}
