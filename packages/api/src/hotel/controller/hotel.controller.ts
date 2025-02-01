import type { Context } from '../../types/common';
import { HotelService } from '../service/hotel.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
export class HotelController {
  constructor(private readonly service: HotelService) {}
  async getHotelList({ req, res, next }: Context) {
    try {
      const { search } = req.query;
      const hotels = await this.service.listHotels(search?.toString());
      res.status(HttpStatusCode.OK).json(hotels);
    } catch (error) {
      next(error);
    }
  }
}
