import { Router } from 'express';
import { setupHotelRoutes } from './hotel.routes';

export async function setupRoutes() {
  const router = Router();

  router.use(await setupHotelRoutes());

  return router;
}
