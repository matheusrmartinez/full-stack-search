import cors from 'cors';
import express, { Request, Response } from 'express';
import HttpServer from './HttpServer';
import { errorHandler } from './routes/error-handling/error.handler';

export default class ExpressAdapter implements HttpServer {
  app: express.Application;
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(errorHandler);
  }

  on(method: string, url: string, callback: Function): void {
    (this.app as any)[method](
      url,
      async function (req: Request, res: Response) {
        try {
          const output = await callback(req.params, req.body);
          res.json(output);
        } catch (e: any) {
          res.status(422).json({
            message: e.message,
          });
        }
      },
    );
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
