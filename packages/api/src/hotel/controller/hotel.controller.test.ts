import { HotelController } from './hotel.controller';
import { HotelService } from '../service/hotel.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { Hotel } from 'schemas';

let hotelController: HotelController;
let hotelService: HotelService;

beforeEach(() => {
  hotelService = {
    listHotels: jest.fn(),
  } as unknown as HotelService;
  hotelController = new HotelController(hotelService);
});

describe('HotelController', () => {
  test('should return a list of hotels with status 200', async () => {
    const mockHotels = [{ id: 1, name: 'Hotel One' }] as unknown as Hotel[];

    // Mock service method
    (hotelService.listHotels as jest.Mock).mockResolvedValue(mockHotels);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      statusCode: 0,
      body: null,
    };

    const next = jest.fn();

    await hotelController.listHotels({ res, next } as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    expect(res.json).toHaveBeenCalledWith(mockHotels);
  });

  test('should call next with an error if service fails', async () => {
    const error = new Error('Service error');

    // Mock service to throw an error
    (hotelService.listHotels as jest.Mock).mockRejectedValue(error);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await hotelController.listHotels({ res, next } as any);

    expect(next).toHaveBeenCalledWith(error);
  });
});
