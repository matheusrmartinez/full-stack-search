import { Router } from 'express';
import { CityController } from '../../city/controller/city.controller';
import { CityService } from '../../city/service/city.service';
import { getMongoClient } from '../../infra/db/mongo';

export async function setupCitiesRoutes(): Promise<Router> {
  const mongoClient = getMongoClient();
  const cityService = new CityService(mongoClient);
  const cityController = new CityController(cityService);
  const citiesRoutes = Router();
  citiesRoutes.get('/cities', async (req, res, next) =>
    cityController.getCityList({ req, res, next }),
  );
  citiesRoutes.get('/cities/:id', async (req, res, next) =>
    cityController.getCity({ req, res, next }),
  );
  return citiesRoutes;
}
