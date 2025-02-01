import { Router } from 'express';
import { setupHotelRoutes } from './hotel.routes';
import { setupCountriesRoutes } from './country.routes';

export async function setupRoutes() {
  const router = Router();

  router.use(await setupHotelRoutes());
  router.use(await setupCountriesRoutes());

  return router;
}
