import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Bu dosyanın konumu: src/utils/env.js
// Proje kökü: ../../
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını proje kökünden yükle
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Env okuma yardımcı fonksiyonu
export function env(name, defaultValue) {
  const value = process.env[name];
  if (value !== undefined) return value;           // boş string olsa bile kabul
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing: process.env['${name}'].`);
}

export const PORT = Number(env('PORT', 3000));
export const MONGODB_USER = env('MONGODB_USER');
export const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
export const MONGODB_URL = env('MONGODB_URL');
export const MONGODB_DB = env('MONGODB_DB');

export const MONGODB_URI =
  `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(MONGODB_PASSWORD)}` +
  `@${MONGODB_URL}/${encodeURIComponent(MONGODB_DB)}?retryWrites=true&w=majority&appName=Cluster0`;
