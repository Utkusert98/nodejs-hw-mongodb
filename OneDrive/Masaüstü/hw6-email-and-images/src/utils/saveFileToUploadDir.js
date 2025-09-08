import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../constant/index.js';

// Accepts a Multer memory storage file (req.file) and writes it to UPLOAD_DIR
const saveFileToUploadDir = async (file) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error('Invalid file payload');
  }
  const ext = path.extname(file.originalname) || '';
  const base = path.basename(file.originalname, ext);
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
  const fileName = `${base}-${unique}${ext}`;
  const newPath = path.join(UPLOAD_DIR, fileName);
  await fs.writeFile(newPath, file.buffer);
  return fileName;
};

export default saveFileToUploadDir;
