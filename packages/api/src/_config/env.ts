import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().default(3003),
    DATABASE_PORT: z.coerce.number().default(3002),
    DATABASE_URL: z.string().default('mongodb://127.0.0.1'),
  })
  .transform((data) => ({
    ...data,
    DATABASE_URL: `${data.DATABASE_URL}:${data.DATABASE_PORT}`,
  }));

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables!', parsedEnv.error.format());
  throw new Error('Invalid environment variables.');
}

export const env = parsedEnv.data;
