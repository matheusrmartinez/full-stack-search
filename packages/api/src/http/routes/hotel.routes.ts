import { Router } from 'express';
import { HotelController } from '../../hotel/controller/hotel.controller';
import { HotelService } from '../../hotel/service/hotel.service';
import { getMongoClient } from '../../infra/db/mongo';

export async function setupHotelRoutes(): Promise<Router> {
  const mongoClient = getMongoClient();
  const hotelService = new HotelService(mongoClient);
  const hotelController = new HotelController(hotelService);

  const hotelRoutes = Router();
  hotelRoutes.get('/hotels', async (req, res, next) =>
    hotelController.getHotelList({ req, res, next }),
  );

  return hotelRoutes;
}
