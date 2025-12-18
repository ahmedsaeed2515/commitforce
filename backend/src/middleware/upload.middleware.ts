import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError';

// Configure multer storage (memory storage for processing with sharp)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(ApiError.badRequest('Only image files are allowed!'));
  }
};

// Upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
