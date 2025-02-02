import { MongoClient, Collection, ObjectId } from 'mongodb';
import { CityDAO } from './city.dao';
import { City } from 'schemas';

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
    ObjectId: jest.fn().mockImplementation((value) => {
      return {
        toHexString: jest.fn().mockReturnValue(value),
      };
    }),
    isValid: jest.fn(),
  };
});

describe('CityDAO', () => {
  let cityDAO: CityDAO;
  let mockDbClient: MongoClient;
  let mockCollection: Collection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn(),
      }),
      findOne: jest.fn(),
    } as unknown as Collection;

    mockDbClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
      }),
    } as unknown as MongoClient;

    cityDAO = new CityDAO(mockDbClient);
  });

  describe('searchCities', () => {
    it('should return a list of cities when a search term is provided', async () => {
      const mockCities: City[] = [
        { name: 'New York' },
        { name: 'Los Angeles' },
      ] as City[];

      (mockCollection.find().toArray as jest.Mock).mockResolvedValue(
        mockCities,
      );

      const result = await cityDAO.searchCities('New');
      expect(result).toEqual(mockCities);
      expect(mockCollection.find).toHaveBeenCalledWith({
        name: { $regex: 'New', $options: 'i' },
      });
    });

    it('should return all cities when no search term is provided', async () => {
      const mockCities: City[] = [
        { name: 'Chicago' },
        { name: 'Houston' },
      ] as City[];

      (mockCollection.find().toArray as jest.Mock).mockResolvedValue(
        mockCities,
      );

      const result = await cityDAO.searchCities();
      expect(result).toEqual(mockCities);
      expect(mockCollection.find).toHaveBeenCalledWith({});
    });
  });
});
