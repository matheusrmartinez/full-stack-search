import type { Context } from '../../types/common';
import { HotelService } from '../service/hotel.service';
import { HttpStatusCode } from '../../http/routes/utils/http-status-code';
export class HotelController {
  constructor(private readonly service: HotelService) {}
  async listHotels({ res, next }: Context) {
    try {
      const hotels = await this.service.listHotels();
      res.status(HttpStatusCode.OK).json(hotels);
    } catch (error) {
      next(error);
    }
  }
}
