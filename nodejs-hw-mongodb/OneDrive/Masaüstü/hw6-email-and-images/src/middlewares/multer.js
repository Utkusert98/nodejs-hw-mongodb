import multer from 'multer';
import path from 'path';
import { TEMP_UPLOAD_DIR, UPLOAD_LIMITS } from '../constant/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random());
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    // cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları eklenebilir'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: UPLOAD_LIMITS.MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

export default upload;
// export const upload = multer({ storage });
