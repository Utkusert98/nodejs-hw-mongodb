import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsController from './controllers/contacts.js'; 

export function setupServer() {
  const app = express();

  // Middleware'ler
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Ana sayfa rotası
  app.get('/', (req, res) => {
    res.send('Express sunucusu çalışıyor!');
  });

  // /contacts GET rotası
  app.get('/contacts', contactsController.getContacts);

  app.get('/contacts/:contactId', contactsController.getContactById);

  // 404 için middleware (en sona konmalı)
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
