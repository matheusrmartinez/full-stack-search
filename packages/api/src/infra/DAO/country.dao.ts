import { ObjectId, type Collection, type MongoClient } from 'mongodb';
import type { Country } from 'schemas';
export class CountryDAO {
  private collection: Collection<Country>;
  private readonly collectionName = 'countries';
  constructor(private readonly dbClient: MongoClient) {
    this.collection = this.dbClient
      .db()
      .collection<Country>(this.collectionName);
  }
  async searchCountries(country?: string) {
    const query = country
      ? {
          country: { $regex: country, $options: 'i' },
        }
      : {};
    return await this.collection.find(query).toArray();
  }
  async searchCountry(country: string) {
    if (!ObjectId.isValid(country)) {
      throw new Error('Invalid country format');
    }
    const result = await this.collection.findOne({
      // @ts-ignore
      _id: new ObjectId(country.trim()),
    });
    return result;
  }
}
