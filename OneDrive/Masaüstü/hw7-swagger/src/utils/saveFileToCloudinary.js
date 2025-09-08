import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

// Cloudinary'yi aç/kapat
const ENABLE_CLOUDINARY = env('ENABLE_CLOUDINARY', 'false') === 'true';

// İsim farklarını destekle: önce CLOUD_* bak; yoksa CLOUDINARY_* değerlerini kullan
const CLOUD_NAME = env('CLOUD_NAME', process.env.CLOUDINARY_CLOUD_NAME);
const API_KEY    = env('API_KEY',    process.env.CLOUD_API_KEY ?? process.env.CLOUDINARY_API_KEY);
const API_SECRET = env('API_SECRET', process.env.CLOUD_API_SECRET ?? process.env.CLOUDINARY_API_SECRET);

if (ENABLE_CLOUDINARY) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error('Cloudinary enabled but missing credentials (CLOUD_* or CLOUDINARY_*).');
  }
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
}

export async function saveFileToCloudinary(localPath, options = {}) {
  if (!ENABLE_CLOUDINARY) {
    throw new Error('Cloudinary disabled. Set ENABLE_CLOUDINARY=true in .env');
  }
  const res = await cloudinary.uploader.upload(localPath, options);
  return res.secure_url; // gerekirse tüm yanıtı döndür
}
