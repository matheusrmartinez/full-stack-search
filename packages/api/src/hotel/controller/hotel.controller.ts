import type { Context } from '../../types/common';
import { HotelService } from '../service/hotel.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
import { NotFoundError } from '../../http/routes/utils/http-errors';
export class HotelController {
  constructor(private readonly service: HotelService) {}
  async getHotelList({ req, res, next }: Context) {
    try {
      const { search } = req.query;
      const hotels = await this.service.searchHotels(search?.toString());

      if (!hotels.length) {
        throw new NotFoundError('no hotels found.');
      }

      res.status(HttpStatusCode.OK).json(hotels);
    } catch (error) {
      next(error);
    }
  }

  async getHotel({ req, res, next }: Context) {
    try {
      debugger;
      const { id } = req.params;
      debugger;
      const hotel = await this.service.getHotel(id);
      if (!hotel) {
        throw new NotFoundError('hotel not found.');
      }
      res.status(HttpStatusCode.OK).json({ hotel });
    } catch (error) {
      next(error);
    }
  }
}
