import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { PORT } from './utils/env.js';

// Swagger UI
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/', (req, res) => res.send('Express sunucusu çalışıyor!'));
  app.use('/contacts', contactsRouter);

  // Swagger UI
  const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
  let swaggerDoc = {};
  try {
    swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  } catch {
    console.warn('Swagger JSON okunamadı. Önce `npm run build-docs` çalıştırılmalı.');
  }
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  // 404 ve hata yakalama
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}
