import type { Context } from 'src/types/common';
import { CountryDAO } from '../../infra/DAO/country.dao';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';

export default class CountryService {
  countryDAO: CountryDAO;

  constructor(readonly countryDao: CountryDAO) {
    this.countryDAO = countryDao;
  }

  async getCountryList({ req, res, next }: Context) {
    try {
      const { country } = req.query;

      if (!country) {
        throw new NotFoundError('country is required.');
      }

      const countries = await this.countryDao.searchCountries(String(country));
      if (!countries?.length) {
        throw new NotFoundError('no countries found.');
      }
      res.status(HttpStatusCode.OK).json({ countries });
    } catch (error) {
      next(error);
    }
  }

  async getCountry({ req, res, next }: Context) {
    try {
      const { id } = req.params;
      const country = await this.countryDao.searchCountry(id);
      if (!country) {
        throw new NotFoundError('country not found.');
      }
      res.status(HttpStatusCode.OK).json({ country });
    } catch (error) {
      next(error);
    }
  }
}
