import { MongoClient, Collection, ObjectId, FindCursor } from 'mongodb';
import { CountryDAO } from './country.dao'; // Adjust path as needed
import { Country } from 'schemas'; // Adjust according to your schema

// Mock MongoDB Client and ObjectId
jest.mock('mongodb', () => {
  const originalModule = jest.requireActual('mongodb');
  return {
    ...originalModule,
    MongoClient: {
      connect: jest.fn().mockResolvedValue({
        db: jest.fn().mockReturnThis(),
        collection: jest.fn(),
      }),
    },
    ObjectId: {
      isValid: jest.fn(),
      createFromHexString: jest.fn(),
    },
  };
});

describe('CountryDAO', () => {
  let countryDAO: CountryDAO;
  let mockDbClient: MongoClient;
  let mockCollection: Collection;
  let mockFindCursor: FindCursor;

  beforeEach(() => {
    mockFindCursor = {
      toArray: jest.fn(),
    } as unknown as FindCursor;

    mockCollection = {
      find: jest.fn().mockReturnValue(mockFindCursor),

      findOne: jest.fn(),
    } as unknown as Collection;

    mockDbClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
      }),
    } as unknown as MongoClient;

    countryDAO = new CountryDAO(mockDbClient);
  });

  describe('searchCountries', () => {
    it('should return a list of countries when a search term is provided', async () => {
      const mockCountries: Country[] = [
        { country: 'Brazil' },
        { country: 'Argentina' },
      ] as Country[];

      (mockFindCursor.toArray as jest.Mock).mockResolvedValue(mockCountries);

      const result = await countryDAO.searchCountries('Brazil');
      expect(result).toEqual(mockCountries);
      expect(mockCollection.find).toHaveBeenCalledWith({
        country: { $regex: 'Brazil', $options: 'i' },
      });
    });

    it('should return all countries when no search term is provided', async () => {
      const mockCountries: Country[] = [
        { country: 'Canada' },
        { country: 'Mexico' },
      ] as Country[];

      (mockFindCursor.toArray as jest.Mock).mockResolvedValue(mockCountries);

      const result = await countryDAO.searchCountries();
      expect(result).toEqual(mockCountries);
      expect(mockCollection.find).toHaveBeenCalledWith({});
    });
  });
});
