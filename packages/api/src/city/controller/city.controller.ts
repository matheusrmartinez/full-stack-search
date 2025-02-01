import type { Context } from 'src/types/common';
import { CityDAO } from '../../infra/DAO/city.dao';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
export class CityController {
  constructor(private readonly service: CityDAO) {}
  async getCityList({ req, res, next }: Context) {
    try {
      const { name } = req.query;
      const cities = await this.service.searchCities(name?.toString());
      if (!cities.length) {
        throw new NotFoundError('no cities found.');
      }
      res.status(HttpStatusCode.OK).json({ cities });
    } catch (error) {
      next(error);
    }
  }
  async getCity({ req, res, next }: Context) {
    try {
      const { id } = req.params;
      const city = await this.service.searchCity(id);
      if (!city) {
        throw new NotFoundError('no city found.');
      }
      res.status(HttpStatusCode.OK).json({ city });
    } catch (error) {
      next(error);
    }
  }
}
