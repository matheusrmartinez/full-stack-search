import { HotelController } from './hotel.controller';
import { HotelService } from '../service/hotel.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { Context } from '../../types/common';

describe('HotelController', () => {
  let hotelController: HotelController;
  let hotelService: HotelService;

  beforeEach(() => {
    hotelService = {
      listHotels: jest.fn(),
    } as unknown as HotelService; // Mocking HotelService
    hotelController = new HotelController(hotelService);
  });

  it('should return a list of hotels with status 200', async () => {
    const mockHotels = [
      { id: 1, name: 'Hotel One' },
      { id: 2, name: 'Hotel Two' },
    ];

    // Mock the service method to return the mock hotels
    hotelService.listHotels = jest.fn().mockResolvedValue(mockHotels);

    const req = { query: { search: 'Hotel' } } as unknown as Context['req'];
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Context['res'];
    const next = jest.fn() as Context['next'];

    await hotelController.getHotelList({ req, res, next });

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(mockHotels);
  });

  it('should call next with an error if service fails', async () => {
    const error = new Error('Service error');
    hotelService.listHotels = jest.fn().mockRejectedValue(error);

    const req = { query: { search: 'Hotel' } } as unknown as Context['req'];
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Context['res'];
    const next = jest.fn() as Context['next'];

    await hotelController.getHotelList({ req, res, next });

    expect(next).toHaveBeenCalledWith(error);
  });
});
