import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

interface ProcessedImage {
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  originalSize: number;
  savedPercentage: number;
}

// Default optimization options for different use cases
export const ImagePresets = {
  avatar: { width: 200, height: 200, quality: 80, format: 'webp' as const, fit: 'cover' as const },
  thumbnail: { width: 300, height: 200, quality: 75, format: 'webp' as const, fit: 'cover' as const },
  cover: { width: 1200, height: 630, quality: 80, format: 'webp' as const, fit: 'cover' as const },
  checkin: { width: 800, height: 800, quality: 85, format: 'webp' as const, fit: 'inside' as const },
  full: { width: 1920, height: 1080, quality: 85, format: 'webp' as const, fit: 'inside' as const },
};

export const imageOptimizer = {
  /**
   * Process and optimize an image buffer
   */
  process: async (
    buffer: Buffer,
    options: ImageOptions = ImagePresets.full
  ): Promise<{ buffer: Buffer; metadata: sharp.OutputInfo }> => {
    const {
      width = 1920,
      height = 1080,
      quality = 85,
      format = 'webp',
      fit = 'inside',
    } = options;

    let pipeline = sharp(buffer);

    // Get original metadata
    const originalMetadata = await pipeline.metadata();

    // Resize if dimensions are specified
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit,
        withoutEnlargement: true, // Don't upscale small images
      });
    }

    // Convert to specified format with quality
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      case 'png':
        pipeline = pipeline.png({ quality });
        break;
      case 'jpeg':
      default:
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    }

    // Process the image
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

    return { buffer: data, metadata: info };
  },

  /**
   * Process an image file and save optimized version
   */
  processFile: async (
    inputPath: string,
    outputDir: string,
    options: ImageOptions = ImagePresets.full
  ): Promise<ProcessedImage> => {
    const buffer = await fs.readFile(inputPath);
    const originalSize = buffer.length;
    
    const { buffer: processedBuffer, metadata } = await imageOptimizer.process(buffer, options);
    
    // Generate unique filename
    const ext = options.format || 'webp';
    const filename = `${uuidv4()}.${ext}`;
    const outputPath = path.join(outputDir, filename);
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write processed image
    await fs.writeFile(outputPath, processedBuffer);
    
    const newSize = processedBuffer.length;
    const savedPercentage = Math.round((1 - newSize / originalSize) * 100);

    return {
      filename,
      path: outputPath,
      mimeType: `image/${options.format || 'webp'}`,
      size: newSize,
      width: metadata.width,
      height: metadata.height,
      originalSize,
      savedPercentage,
    };
  },

  /**
   * Generate multiple sizes (thumbnails, previews, etc.)
   */
  generateVariants: async (
    buffer: Buffer,
    variants: Record<string, ImageOptions>
  ): Promise<Record<string, { buffer: Buffer; metadata: sharp.OutputInfo }>> => {
    const results: Record<string, { buffer: Buffer; metadata: sharp.OutputInfo }> = {};

    for (const [name, options] of Object.entries(variants)) {
      results[name] = await imageOptimizer.process(buffer, options);
    }

    return results;
  },

  /**
   * Extract dominant colors from an image
   */
  extractColors: async (buffer: Buffer, count: number = 5): Promise<string[]> => {
    const { dominant, palette } = await sharp(buffer)
      .resize(100, 100, { fit: 'cover' }) // Resize for faster processing
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(async ({ data, info }) => {
        // Simple color extraction (for production, use a library like color-thief)
        const pixels: Array<[number, number, number]> = [];
        for (let i = 0; i < data.length; i += 3) {
          pixels.push([data[i], data[i + 1], data[i + 2]]);
        }
        
        // Get unique colors (simplified)
        const colorMap = new Map<string, number>();
        pixels.forEach(([r, g, b]) => {
          // Quantize colors
          const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        });
        
        // Sort by frequency and get top colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, count)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return rgbToHex(r, g, b);
          });
        
        return {
          dominant: sortedColors[0] || '#6366f1',
          palette: sortedColors,
        };
      });

    return palette;
  },

  /**
   * Apply blur placeholder for lazy loading
   */
  generateBlurPlaceholder: async (buffer: Buffer): Promise<string> => {
    const placeholder = await sharp(buffer)
      .resize(10, 10, { fit: 'cover' })
      .blur(2)
      .toBuffer();

    return `data:image/jpeg;base64,${placeholder.toString('base64')}`;
  },

  /**
   * Get image metadata
   */
  getMetadata: async (buffer: Buffer): Promise<sharp.Metadata> => {
    return sharp(buffer).metadata();
  },

  /**
   * Validate image (dimensions, format, etc.)
   */
  validate: async (
    buffer: Buffer,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      maxSizeBytes?: number;
      allowedFormats?: string[];
    } = {}
  ): Promise<{ valid: boolean; errors: string[] }> => {
    const errors: string[] = [];
    const metadata = await sharp(buffer).metadata();

    const {
      maxWidth = 8000,
      maxHeight = 8000,
      maxSizeBytes = 10 * 1024 * 1024, // 10MB
      allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'],
    } = options;

    if (metadata.width && metadata.width > maxWidth) {
      errors.push(`Image width (${metadata.width}px) exceeds maximum (${maxWidth}px)`);
    }

    if (metadata.height && metadata.height > maxHeight) {
      errors.push(`Image height (${metadata.height}px) exceeds maximum (${maxHeight}px)`);
    }

    if (buffer.length > maxSizeBytes) {
      errors.push(`File size (${(buffer.length / 1024 / 1024).toFixed(2)}MB) exceeds maximum (${(maxSizeBytes / 1024 / 1024).toFixed(2)}MB)`);
    }

    if (metadata.format && !allowedFormats.includes(metadata.format)) {
      errors.push(`Format '${metadata.format}' not allowed. Allowed: ${allowedFormats.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

// Helper function
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export default imageOptimizer;
