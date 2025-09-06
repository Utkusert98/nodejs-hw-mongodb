import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/authRouter.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || true,
    credentials: true,
  }));
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (_req, res) => {
    res.send('Express sunucusu çalışıyor!');
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
