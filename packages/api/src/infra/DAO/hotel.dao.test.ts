import { MongoClient, Collection, ObjectId } from 'mongodb';
import { HotelDAO } from './hotel.dao';
import { Hotel } from 'schemas';

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

describe('HotelDAO', () => {
  let hotelDAO: HotelDAO;
  let mockDbClient: MongoClient;
  let mockCollection: Collection;
  let mockFindCursor: any;

  beforeEach(() => {
    mockFindCursor = {
      toArray: jest.fn(),
    };

    mockCollection = {
      find: jest.fn().mockReturnValue(mockFindCursor),
    } as unknown as Collection;

    mockDbClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
      }),
    } as unknown as MongoClient;

    hotelDAO = new HotelDAO(mockDbClient);
  });

  describe('searchHotels', () => {
    it('should return a list of hotels when a search term is provided', async () => {
      const mockHotels: Hotel[] = [
        { hotelName: 'Grand Hotel', city: 'Paris', country: 'France' },
        { hotelName: 'Luxury Resort', city: 'Nice', country: 'France' },
      ] as Hotel[];

      (mockFindCursor.toArray as jest.Mock).mockResolvedValue(mockHotels);

      const result = await hotelDAO.searchHotels('Grand');
      expect(result).toEqual(mockHotels);

      const expectedQuery = {
        $or: [
          { chainName: { $regex: /Grand/i } },
          { hotelName: { $regex: /Grand/i } },
          { city: { $regex: /Grand/i } },
          { state: { $regex: /Grand/i } },
          { zipCode: { $regex: /Grand/i } },
          { country: { $regex: /Grand/i } },
          { addressLine1: { $regex: /Grand/i } },
          { addressLine2: { $regex: /Grand/i } },
        ],
      };

      expect(mockCollection.find).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return all hotels when no search term is provided', async () => {
      const mockHotels: Hotel[] = [
        { hotelName: 'Holiday Inn', city: 'New York', country: 'USA' },
        { hotelName: 'Marriott', city: 'Los Angeles', country: 'USA' },
      ] as Hotel[];

      (mockFindCursor.toArray as jest.Mock).mockResolvedValue(mockHotels);

      const result = await hotelDAO.searchHotels();
      expect(result).toEqual(mockHotels);
      expect(mockCollection.find).toHaveBeenCalledWith({});
    });
  });
});
