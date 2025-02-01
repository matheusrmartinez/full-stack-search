import express from 'express';
import cors from 'cors';
import { env } from './_config/env';
import { connectToMongoDB } from './infra/db/mongo';
import { setupRoutes } from './http/routes';
import { errorHandler } from './http/routes/utils/error.handler';

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await connectToMongoDB();

    app.use(await setupRoutes());
    app.use(errorHandler);

    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(`API Server Started at ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
})();
