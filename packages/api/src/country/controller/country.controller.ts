import type { Context } from 'src/types/common';
import { CountryDAO } from '../../infra/DAO/country.dao';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
export class CountryController {
  constructor(private readonly service: CountryDAO) {}
  async getCountryList({ req, res, next }: Context) {
    try {
      const { country } = req.query;
      const countries = await this.service.searchCountries(country?.toString());
      if (!countries.length) {
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
      const country = await this.service.searchCountry(id);
      if (!country) {
        throw new NotFoundError('country not found.');
      }
      res.status(HttpStatusCode.OK).json({ country });
    } catch (error) {
      next(error);
    }
  }
}
