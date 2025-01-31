import type { Context } from 'src/types/common';
import { HotelService } from '../service';
import { HttpStatusCode } from 'src/http/routes/utils/http-status-code';
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
