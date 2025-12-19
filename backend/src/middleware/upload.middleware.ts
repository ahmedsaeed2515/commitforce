import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { imageOptimizer, ImagePresets } from '../services/imageOptimizer.service';

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
    fileSize: 10 * 1024 * 1024, // 10MB limit (will be compressed)
  },
});

// Image optimization middleware
type ImagePresetKey = keyof typeof ImagePresets;

export const optimizeImage = (preset: ImagePresetKey = 'full') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next();
      }

      const originalSize = req.file.size;
      const options = ImagePresets[preset];

      // Process and optimize the image
      const { buffer, metadata } = await imageOptimizer.process(req.file.buffer, options);

      // Update the file with optimized version
      req.file.buffer = buffer;
      req.file.size = buffer.length;
      req.file.mimetype = `image/${options.format || 'webp'}`;

      // Add optimization metadata to request
      (req as any).imageOptimization = {
        originalSize,
        optimizedSize: buffer.length,
        savedBytes: originalSize - buffer.length,
        savedPercentage: Math.round((1 - buffer.length / originalSize) * 100),
        width: metadata.width,
        height: metadata.height,
        format: options.format,
      };

      console.log(`Image optimized: ${originalSize} -> ${buffer.length} bytes (${(req as any).imageOptimization.savedPercentage}% saved)`);

      next();
    } catch (error) {
      console.error('Image optimization error:', error);
      // Continue without optimization if it fails
      next();
    }
  };
};

// Optimize multiple images
export const optimizeImages = (preset: ImagePresetKey = 'full') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return next();
      }

      const options = ImagePresets[preset];
      const optimizedFiles: Express.Multer.File[] = [];
      let totalOriginalSize = 0;
      let totalOptimizedSize = 0;

      for (const file of req.files) {
        totalOriginalSize += file.size;

        const { buffer, metadata } = await imageOptimizer.process(file.buffer, options);
        
        file.buffer = buffer;
        file.size = buffer.length;
        file.mimetype = `image/${options.format || 'webp'}`;
        
        totalOptimizedSize += buffer.length;
        optimizedFiles.push(file);
      }

      req.files = optimizedFiles;

      (req as any).imagesOptimization = {
        count: optimizedFiles.length,
        totalOriginalSize,
        totalOptimizedSize,
        savedBytes: totalOriginalSize - totalOptimizedSize,
        savedPercentage: Math.round((1 - totalOptimizedSize / totalOriginalSize) * 100),
      };

      console.log(`${optimizedFiles.length} images optimized: ${totalOriginalSize} -> ${totalOptimizedSize} bytes`);

      next();
    } catch (error) {
      console.error('Images optimization error:', error);
      next();
    }
  };
};

// Generate blur placeholder
export const generateBlurPlaceholder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }

    const placeholder = await imageOptimizer.generateBlurPlaceholder(req.file.buffer);
    (req as any).blurPlaceholder = placeholder;

    next();
  } catch (error) {
    console.error('Blur placeholder generation error:', error);
    next();
  }
};
