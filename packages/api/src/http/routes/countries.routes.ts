// import { Router } from 'express';
// import { getMongoClient } from '../../infra/db/mongo';
// import { CountryController } from '../../country/controller/country.controller';
// import { CountryDAO } from '../../infra/DAO/country.dao';
// export async function setupCountriesRoutes(): Promise<Router> {
//   const mongoClient = getMongoClient();
//   const countryService = new CountryDAO(mongoClient);
//   const countryController = new CountryController(countryService);
//   const countriesRoutes = Router();

//   return countriesRoutes;
// }
