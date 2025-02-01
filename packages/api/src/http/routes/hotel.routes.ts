import { Router } from 'express';
import { HotelController } from 'src/hotel/controller/hotel.controller';
import { HotelService } from 'src/hotel/service/hotel.service';
import { getMongoClient } from 'src/infra/db/mongo';

export async function setupHotelRoutes(): Promise<Router> {
  const mongoClient = getMongoClient();
  const hotelService = new HotelService(mongoClient);
  const hotelController = new HotelController(hotelService);

  const hotelRoutes = Router();
  hotelRoutes.get('/hotels', async (req, res, next) =>
    hotelController.listHotels({ req, res, next }),
  );

  return hotelRoutes;
}
