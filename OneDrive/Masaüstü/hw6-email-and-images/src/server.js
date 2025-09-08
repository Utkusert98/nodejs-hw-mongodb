import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';

import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(env('PORT', 3000));

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  // static uploads if using local storage
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.get('/', (_req, res) => res.send('API up'));

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
