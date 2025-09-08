import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc', // artan sıralama
  DESC: 'desc', // azalan sıralama
};

//auth için sabit değerler

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 1000 * 60 * 60 * 24;

// Kullanıcı rolleri

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
  ENABLE_CLOUDINARY: 'ENABLE_CLOUDINARY',
};

//DOSYA YÜKLEME LİMİTİ

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_FILES: 10,
};
