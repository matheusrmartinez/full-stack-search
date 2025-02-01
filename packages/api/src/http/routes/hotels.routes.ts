import { Router } from 'express';
import { HotelController } from '../../hotel/controller/hotel.controller';
import { HotelDAO } from '../../infra/DAO/hotel.dao';
import { getMongoClient } from '../../infra/db/mongo';

export async function setupHotelRoutes(): Promise<Router> {
  const mongoClient = getMongoClient();
  const hotelService = new HotelDAO(mongoClient);
  const hotelController = new HotelController(hotelService);

  const hotelRoutes = Router();
  hotelRoutes.get('/hotels', async (req, res, next) =>
    hotelController.getHotelList({ req, res, next }),
  );
  hotelRoutes.get('/hotels/:id', async (req, res, next) =>
    hotelController.getHotel({ req, res, next }),
  );

  return hotelRoutes;
}
