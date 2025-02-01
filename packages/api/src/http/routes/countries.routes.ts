import { Router } from 'express';
import { getMongoClient } from '../../infra/db/mongo';
import { CountryController } from '../../country/controller/country.controller';
import { CountryService } from '../../country/service/country.service';
export async function setupCountriesRoutes(): Promise<Router> {
  const mongoClient = getMongoClient();
  const countryService = new CountryService(mongoClient);
  const countryController = new CountryController(countryService);
  const countriesRoutes = Router();
  countriesRoutes.get('/countries', async (req, res, next) =>
    countryController.getCountryList({ req, res, next }),
  );
  countriesRoutes.get('/countries/:id', async (req, res, next) =>
    countryController.getCountry({ req, res, next }),
  );
  return countriesRoutes;
}
