import { HotelDAO } from '../../infra/DAO/hotel.dao';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
import type { Context } from '../../types/common';
import { HotelController } from './hotel.controller';

jest.mock('../../infra/DAO/hotel.dao');

describe('HotelController', () => {
  let hotelDAO: jest.Mocked<HotelDAO>;
  let hotelController: HotelController;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    hotelDAO = {
      searchHotels: jest.fn(),
      searchHotel: jest.fn(),
    } as unknown as jest.Mocked<HotelDAO>;
    hotelController = new HotelController(hotelDAO);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('getHotelList', () => {
    it('should return a list of hotels', async () => {
      const mockRequest = { query: { search: 'Hilton' } } as any;
      const mockHotels = [
        {
          _id: '1',
          chainName: 'Hilton',
          hotelName: 'Hilton Hotel',
          addressLine1: '123 Hilton St',
          addressLine2: null,
          zipCode: '12345',
          city: 'Hilton City',
          state: 'Hilton State',
          starRating: 5,
          country: 'USA',
          countryIsoCode: 'US',
        },
      ];
      hotelDAO.searchHotels.mockResolvedValue(mockHotels);

      await hotelController.getHotelList({
        req: mockRequest,
        res: mockResponse,
        next: mockNext,
      } as Context);

      expect(hotelDAO.searchHotels).toHaveBeenCalledWith('Hilton');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHotels);
    });

    it('should call next with NotFoundError when no hotels are found', async () => {
      const mockRequest = { query: { search: 'Unknown' } } as any;
      hotelDAO.searchHotels.mockResolvedValue([]);

      await hotelController.getHotelList({
        req: mockRequest,
        res: mockResponse,
        next: mockNext,
      } as Context);

      expect(mockNext).toHaveBeenCalledWith(
        new NotFoundError('no hotels found.'),
      );
    });
  });

  describe('getHotel', () => {
    it('should return a hotel by id', async () => {
      const mockRequest = { params: { id: '123' } } as any;
      const mockHotel = {
        _id: '1',
        chainName: 'Hilton',
        hotelName: 'Hilton Hotel',
        addressLine1: '123 Hilton St',
        addressLine2: null,
        zipCode: '12345',
        city: 'Hilton City',
        state: 'Hilton State',
        starRating: 5,
        country: 'USA',
        countryIsoCode: 'US',
      };
      hotelDAO.searchHotel.mockResolvedValue(mockHotel);

      await hotelController.getHotel({
        req: mockRequest,
        res: mockResponse,
        next: mockNext,
      } as Context);

      expect(hotelDAO.searchHotel).toHaveBeenCalledWith('123');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ hotel: mockHotel });
    });

    it('should call next with NotFoundError when hotel is not found', async () => {
      const mockRequest = { params: { id: '999' } } as any;
      hotelDAO.searchHotel.mockResolvedValue(null);

      await hotelController.getHotel({
        req: mockRequest,
        res: mockResponse,
        next: mockNext,
      } as Context);

      expect(mockNext).toHaveBeenCalledWith(
        new NotFoundError('hotel not found.'),
      );
    });
  });
});
