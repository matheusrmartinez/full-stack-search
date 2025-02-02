import { CountryController } from '../../country/controller/country.controller';
import { CountryDAO } from '../../infra/DAO/country.dao';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';

describe('CountryController', () => {
  let countryController: CountryController;
  let countryDAO: jest.Mocked<CountryDAO>;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    countryDAO = {
      searchCountries: jest.fn(),
      searchCountry: jest.fn(),
    } as unknown as jest.Mocked<CountryDAO>;

    countryController = new CountryController(countryDAO);

    req = { query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('getCountryList', () => {
    it('should return a list of countries when found', async () => {
      const mockCountries = [
        { _id: '1', country: 'USA', countryIsoCode: 'US' },
      ];
      countryDAO.searchCountries.mockResolvedValue(mockCountries);
      req.query.country = 'USA';

      await countryController.getCountryList({ req, res, next });

      expect(countryDAO.searchCountries).toHaveBeenCalledWith('USA');
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({ countries: mockCountries });
    });

    it('should throw NotFoundError if no countries are found', async () => {
      countryDAO.searchCountries.mockResolvedValue([]);
      req.query.country = 'Unknown';

      await countryController.getCountryList({ req, res, next });

      expect(countryDAO.searchCountries).toHaveBeenCalledWith('Unknown');
      expect(next).toHaveBeenCalledWith(
        new NotFoundError('no countries found.'),
      );
    });

    it('should call next with an error if searchCountries throws an error', async () => {
      const error = new Error('Database error');
      countryDAO.searchCountries.mockRejectedValue(error);
      req.query.country = 'ErrorCountry';

      await countryController.getCountryList({ req, res, next });

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getCountry', () => {
    it('should return a country when found', async () => {
      const mockCountry = { _id: '1', country: 'USA', countryIsoCode: 'US' };
      countryDAO.searchCountry.mockResolvedValue(mockCountry);
      req.params.id = '1';

      await countryController.getCountry({ req, res, next });

      expect(countryDAO.searchCountry).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({ country: mockCountry });
    });

    it('should throw NotFoundError if country is not found', async () => {
      countryDAO.searchCountry.mockResolvedValue(null);
      req.params.id = '999';

      await countryController.getCountry({ req, res, next });

      expect(countryDAO.searchCountry).toHaveBeenCalledWith('999');
      expect(next).toHaveBeenCalledWith(
        new NotFoundError('country not found.'),
      );
    });

    it('should call next with an error if searchCountry throws an error', async () => {
      const error = new Error('Database error');
      countryDAO.searchCountry.mockRejectedValue(error);
      req.params.id = 'error';

      await countryController.getCountry({ req, res, next });

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
