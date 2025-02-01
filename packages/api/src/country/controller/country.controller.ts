import inject from '../../di/inject.decorator';
import CountryService from '../service/country.service';
import HttpServer from '../../http/HttpServer';
import { NextFunction, Request, Response } from 'express';
export class CountryController {
  @inject('countryService')
  countryService?: CountryService;
  @inject('httpServer')
  httpServer?: HttpServer;

  constructor() {
    this.httpServer?.on(
      'get',
      '/countries',
      async (req: Request, res: Response, next: NextFunction) => {
        return this.countryService?.getCountryList({ req, res, next });
      },
    );
    this.httpServer?.on(
      'get',
      '/countries/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        return this.countryService?.getCountry({ req, res, next });
      },
    );
  }
}
