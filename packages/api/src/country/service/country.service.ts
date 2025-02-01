import type { Collection, MongoClient } from 'mongodb';
import type { Country } from 'schemas';
export class CountryService {
  private collection: Collection<Country>;
  constructor(
    private readonly dbClient: MongoClient,
    private readonly collectionName = 'countries',
  ) {
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
}
