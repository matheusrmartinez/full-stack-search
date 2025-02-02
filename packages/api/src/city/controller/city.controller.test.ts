import { CityDAO } from '../../infra/DAO/city.dao';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
import type { Request, Response, NextFunction } from 'express';
import { CityController } from './city.controller';

describe('CityController', () => {
  let cityDAO: CityDAO;
  let cityController: CityController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    cityDAO = {
      searchCities: jest.fn(),
      searchCity: jest.fn(),
    } as unknown as CityDAO;

    cityController = new CityController(cityDAO);

    req = {
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getCityList', () => {
    it('should return a list of cities when found', async () => {
      req.query = { name: 'New York' };
      const mockCities = [{ id: '1', name: 'New York' }];
      (cityDAO.searchCities as jest.Mock).mockResolvedValue(mockCities);

      await cityController.getCityList({
        req: req as Request,
        res: res as Response,
        next,
      });

      expect(cityDAO.searchCities).toHaveBeenCalledWith('New York');
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({ cities: mockCities });
    });

    it('should throw NotFoundError when no cities are found', async () => {
      req.query = { name: 'Unknown City' };
      (cityDAO.searchCities as jest.Mock).mockResolvedValue([]);

      await cityController.getCityList({
        req: req as Request,
        res: res as Response,
        next,
      });

      expect(cityDAO.searchCities).toHaveBeenCalledWith('Unknown City');
      expect(next).toHaveBeenCalledWith(new NotFoundError('no cities found.'));
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      (cityDAO.searchCities as jest.Mock).mockRejectedValue(error);

      await cityController.getCityList({
        req: req as Request,
        res: res as Response,
        next,
      });

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getCity', () => {
    it('should return a city when found', async () => {
      req.params = { id: '1' };
      const mockCity = { id: '1', name: 'New York' };
      (cityDAO.searchCity as jest.Mock).mockResolvedValue(mockCity);

      await cityController.getCity({
        req: req as Request,
        res: res as Response,
        next,
      });

      expect(cityDAO.searchCity).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({ city: mockCity });
    });

    it('should throw NotFoundError when city is not found', async () => {
      req.params = { id: '2' };
      (cityDAO.searchCity as jest.Mock).mockResolvedValue(null);

      await cityController.getCity({
        req: req as Request,
        res: res as Response,
        next,
      });

      expect(cityDAO.searchCity).toHaveBeenCalledWith('2');
      expect(next).toHaveBeenCalledWith(new NotFoundError('no city found.'));
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');
      (cityDAO.searchCity as jest.Mock).mockRejectedValue(error);

      await cityController.getCity({
        req: req as Request,
        res: res as Response,
        next,
      });

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
