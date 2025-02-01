import type { Context } from 'src/types/common';
import { CountryService } from '../service/country.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
export class CountryController {
  constructor(private readonly service: CountryService) {}
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
}
