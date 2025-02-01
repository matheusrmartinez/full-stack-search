import Registry from './di/registry.container';
import CountryService from './country/service/country.service';
import ExpressAdapter from './http/ExpressAdapter';
import { CountryDAO } from './infra/DAO/country.dao';
import MongoDBAdapter from './infra/db/MongDBAdapter';
import { CountryController } from './country/controller/country.controller';

const httpServer = new ExpressAdapter();
const connection = new MongoDBAdapter().getMongoClient();
const countryDAO = new CountryDAO(connection);

Registry.getInstance().provide(
  'countryService',
  new CountryService(countryDAO),
);
Registry.getInstance().provide('httpServer', httpServer);
new CountryController();
httpServer.listen(3000);
