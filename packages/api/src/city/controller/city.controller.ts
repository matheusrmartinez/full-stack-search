import type { Context } from 'src/types/common';
import { CityService } from '../service/city.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
export class CityController {
  constructor(private readonly service: CityService) {}
  async listCities({ req, res, next }: Context) {
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
}
